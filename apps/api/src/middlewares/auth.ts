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
      .select('id, date_validity, USERS_ROLES(id_role)')
      .eq('id_auth, id_role', data.user.id)
      .single();

    if (userError || !user) throw new HTTPException(404, { message: 'User not found' });

    c.set('user', {
      id: user.id,
      roles: accountRolesValidity(user.date_validity, user.USERS_ROLES),
      email: data.user?.email,
      updated_at: data.user?.updated_at,
      created_at: data.user?.created_at,
    });
  }

  if (error) throw new HTTPException(403, { message: 'Invalid token' });

  await next();
};

/* Info :
if date is null and roles is empty it means that it's a basic user with no roles.

if date is not null and it's less than the current date it means that the user subscription is expired, 
so it has no roles but we don't remove user roles from the database.

if date is not null and it's greater than the current date it means that the user subscription is still valid.
*/
export function accountRolesValidity(date: null | string, roles: { id_role: number }[]): number[] {
  if (date === null) return [];

  if (date !== null && new Date(date) < new Date()) return [];

  return roles.map((role) => role.id_role);
}

export default authMiddleware;
