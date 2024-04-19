import type { MiddlewareHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { supabase } from '../libs/supabase.js';
import { getToken } from '../utils/context.js';

const authMiddleware: MiddlewareHandler = async (c, next) => {
  const token = getToken(c);
  const { data, error } = await supabase.auth.getUser(token);

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

  if (error) throw new HTTPException(403, { message: 'Invalid token' });

  await next();
};

export default authMiddleware;
