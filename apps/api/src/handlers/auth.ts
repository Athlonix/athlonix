import {supabase} from '../libs/supabase';
import {zValidator} from '@hono/zod-validator';
import {Hono} from 'hono';
import {getCookie, setCookie} from 'hono/cookie';
import {HTTPException} from 'hono/http-exception';
import {z} from 'zod';

const authRoutes = new Hono()
  .post(
    '/sign-up',
    zValidator(
      'json',
      z.object({
        email: z.string(),
        password: z.string().min(8),
      })
    ),
    async (c) => {
      const {email, password} = c.req.valid('json');

      const {data, error} = await supabase.auth.signUp({
        email,
        password,
      });
      if (error || !data?.user?.email) {
        console.log(error);
        throw new Error(error?.message || 'Error while signing up', {
          cause: error,
        });
      }
      return c.json({message: 'User created successfully'});
    }
  )
  .post(
    '/login',
    zValidator(
      'json',
      z.object({
        email: z.string(),
        password: z.string().min(8),
      })
    ),
    async (c) => {
      const {email, password} = c.req.valid('json');

      const {data, error} = await supabase.auth.signInWithPassword({email, password});

      if (error) {
        console.error('Error while signing in', error);
        throw new HTTPException(401, {message: error.message});
      }

      setCookie(c, 'access_token', data?.session.access_token, {
        ...(data?.session.expires_at && {expires: new Date(data.session.expires_at)}),
        httpOnly: true,
        path: '/',
        secure: true,
      });

      setCookie(c, 'refresh_token', data?.session.refresh_token, {
        ...(data?.session.expires_at && {expires: new Date(data.session.expires_at)}),
        httpOnly: true,
        path: '/',
        secure: true,
      });

      return c.json({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });
    }
  )
  .get('/refresh', async (c) => {
    const refresh_token = getCookie(c, 'refresh_token');
    if (!refresh_token) {
      throw new HTTPException(403, {message: 'No refresh token'});
    }

    const {data, error} = await supabase.auth.refreshSession({
      refresh_token,
    });

    if (error) {
      console.error('Error while refreshing token', error);
      throw new HTTPException(403, {message: error.message});
    }

    if (data?.session) {
      setCookie(c, 'refresh_token', data.session.refresh_token, {
        ...(data.session.expires_at && {expires: new Date(data.session.expires_at)}),
      });
    }

    return c.json({message: 'Token refreshed'});
  });

export default authRoutes;
