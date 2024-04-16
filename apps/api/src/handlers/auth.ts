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
  const { email, password, first_name, last_name, username } = c.req.valid('json');

  const { data: userExist } = await supabase.from('USERS').select('id').eq('email', email);
  if (userExist && userExist.length > 0) {
    return c.json({ message: 'Email already exists' }, 400);
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !data?.user?.email) {
    throw new Error(error?.message || 'Error while signing up', {
      cause: error,
    });
  }

  const { data: user, error: insertError } = await supabase
    .from('USERS')
    .insert({
      email: data.user.email,
      username: username || '',
      first_name: first_name || '',
      last_name: last_name || '',
      id_referer: null,
      id_role: 1,
      id_auth: data.user.id,
    })
    .select()
    .single();

  if (insertError) {
    throw new Error('Error while creating user', {
      cause: insertError,
    });
  }

  return c.json(user, 201);
});

auth.openapi(loginUser, async (c) => {
  const { email, password } = c.req.valid('json');

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw new HTTPException(401, { message: error.message });

  const { data: user, error: userError } = await supabase
    .from('USERS')
    .select('*')
    .eq('id_auth', data.user.id)
    .single();

  if (userError || !user) throw new HTTPException(404, { message: 'User not found' });

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

  return c.json(user, 200);
});

auth.openapi(refreshTokens, async (c) => {
  const refresh_token = getCookie(c, 'refresh_token');
  if (!refresh_token) {
    throw new HTTPException(403, { message: 'No refresh token' });
  }

  const { data, error } = await supabase.auth.refreshSession({
    refresh_token,
  });

  if (error) throw new HTTPException(403, { message: error.message });

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
