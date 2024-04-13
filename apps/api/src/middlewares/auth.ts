import type { MiddlewareHandler } from 'hono';
import { getCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { supabase } from '../libs/supabase.js';

const authMiddleware: MiddlewareHandler = async (c, next) => {
  const access_token = getCookie(c, 'access_token');
  if (!access_token) throw new HTTPException(403, { message: 'No access token' });
  const { data, error } = await supabase.auth.getUser(access_token);

  if (data?.user) {
    c.set('id_auth', data.user.id);
  }
  if (error) {
    const refresh_token = getCookie(c, 'refresh_token');
    if (!refresh_token) throw new HTTPException(403, { message: 'No refresh token' });

    const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession({
      refresh_token,
    });

    if (refreshError) throw new HTTPException(403, { message: 'Error while refreshing token' });

    if (refreshed.user) {
      c.set('id_auth', refreshed.user.id);
    }
  }

  await next();
};

export default authMiddleware;
