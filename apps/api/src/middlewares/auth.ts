import type { MiddlewareHandler } from 'hono';
import { getCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { supabase } from '../libs/supabase.js';

const authMiddleware: MiddlewareHandler = async (c, next) => {
  const access_token = getCookie(c, 'access_token');
  if (!access_token) throw new HTTPException(403, { message: 'No access token' });
  const { data, error } = await supabase.auth.getUser(access_token);

  if (data?.user) {
    const { data: user, error: userError } = await supabase
      .from('USERS')
      .select('id, USERS_ROLES(id_role)')
      .eq('id_auth, id_role', data.user.id)
      .single();

    if (userError || !user) throw new HTTPException(404, { message: 'User not found' });

    const roles = user.USERS_ROLES.map((role) => role.id_role);

    c.set('user', {
      id: user.id,
      roles: roles,
      email: data.user.email,
      updated_at: data.user.updated_at,
      created_at: data.user.created_at,
    });
  }

  if (error) {
    const refresh_token = getCookie(c, 'refresh_token');
    if (!refresh_token) throw new HTTPException(403, { message: 'No refresh token' });

    const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession({
      refresh_token,
    });

    if (refreshError) {
      console.error('Error while refreshing token', refreshError);
      throw new HTTPException(403, { message: 'Error while refreshing token' });
    }
    if (!refreshed.user) throw new HTTPException(403, { message: 'No user found in refreshed session' });

    const { data: user, error: userError } = await supabase
      .from('USERS')
      .select('id, USERS_ROLES(id_role)')
      .eq('id_auth', refreshed.user.id)
      .single();

    if (userError || !user) throw new HTTPException(404, { message: 'User not found' });

    const roles = user.USERS_ROLES.map((role) => role.id_role);

    if (refreshed.user) {
      c.set('user', {
        id: user.id,
        roles: roles,
        email: refreshed.user.email,
        updated_at: refreshed.user.updated_at,
        created_at: refreshed.user.created_at,
      });
    }
  }

  await next();
};

export default authMiddleware;
