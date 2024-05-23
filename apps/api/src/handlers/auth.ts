import { OpenAPIHono } from '@hono/zod-openapi';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { supAdmin, supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import { loginUser, logoutUser, refreshTokens, signupUser } from '../routes/auth.js';
import { getToken } from '../utils/context.js';
import type { Variables } from '../validators/general.js';

export const auth = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

auth.openapi(signupUser, async (c) => {
  const { email, password, first_name, last_name, username } = c.req.valid('json');

  const { data: userExist } = await supabase.from('USERS').select('id').eq('email', email);
  if (userExist && userExist.length > 0) {
    return c.json({ error: 'Email already exists' }, 400);
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !data?.user?.email) {
    return c.json({ error: 'Error while creating user' }, 400);
  }

  const { data: user, error: insertError } = await supabase
    .from('USERS')
    .insert({
      email: data.user.email,
      username: username || '',
      first_name: first_name || '',
      last_name: last_name || '',
      id_referer: null,
      date_validity: null,
      id_auth: data.user.id,
      created_at: new Date().toISOString(),
      deleted_at: null,
    })
    .select()
    .single();

  if (insertError) {
    return c.json({ error: 'Error while creating user' }, 400);
  }

  return c.json(user, 201);
});

auth.openapi(loginUser, async (c) => {
  const { email, password } = c.req.valid('json');

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw new HTTPException(401, { message: error.message });

  const { data: user, error: userError } = await supabase
    .from('USERS')
    .select('*, roles:ROLES (id, name)')
    .eq('id_auth', data.user.id)
    .single();

  if (userError || !user) throw new HTTPException(404, { message: 'User not found' });
  if (user.deleted_at !== null) throw new HTTPException(404, { message: 'User has been deleted' });

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

  const token = data.session.access_token;

  return c.json({ user, token }, 200);
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

  return c.json({ message: 'Token refreshed' }, 200);
});

auth.openapi(logoutUser, async (c) => {
  const token = getToken(c);
  if (token) {
    const token = getCookie(c, 'access_token') as string;
    await supAdmin.auth.admin.signOut(token);
    if (getCookie(c, 'refresh_token') && getCookie(c, 'access_token')) {
      deleteCookie(c, 'refresh_token');
      deleteCookie(c, 'access_token');
    }
  }

  return c.json({ message: 'Logged out' }, 200);
});
