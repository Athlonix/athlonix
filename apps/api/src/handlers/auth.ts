import { OpenAPIHono } from '@hono/zod-openapi';
import { getCookie, setCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import { loginUser, refreshTokens, signupUser } from '../routes/auth.js';

export const auth = new OpenAPIHono({
  defaultHook: zodErrorHook,
});

auth.openapi(signupUser, async (c) => {
  const { email, password } = c.req.valid('json');

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !data?.user?.email) {
    throw new Error(error?.message || 'Error while signing up', {
      cause: error,
    });
  }
  return c.json({ message: 'User created successfully' });
});

auth.openapi(loginUser, async (c) => {
  const { email, password } = c.req.valid('json');

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('Error while signing in', error);
    throw new HTTPException(401, { message: error.message });
  }

  setCookie(c, 'access_token', data?.session.access_token, {
    maxAge: 31536000, // 1 year
    httpOnly: true,
    path: '/',
    secure: true,
  });

  setCookie(c, 'refresh_token', data?.session.refresh_token, {
    maxAge: 31536000,
    httpOnly: true,
    path: '/',
    secure: true,
  });

  return c.json({ message: 'User logged in' }, 200);
});

auth.openapi(refreshTokens, async (c) => {
  const refresh_token = getCookie(c, 'refresh_token');
  if (!refresh_token) {
    throw new HTTPException(403, { message: 'No refresh token' });
  }

  const { data, error } = await supabase.auth.refreshSession({
    refresh_token,
  });

  if (error) {
    console.error('Error while refreshing token', error);
    throw new HTTPException(403, { message: error.message });
  }

  if (data?.session) {
    setCookie(c, 'refresh_token', data.session.refresh_token, {
      maxAge: 31536000,
      httpOnly: true,
      path: '/',
      secure: true,
    });
  }

  return c.json({ message: 'Token refreshed' });
});
