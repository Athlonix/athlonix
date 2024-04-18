import { OpenAPIHono } from '@hono/zod-openapi';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import { addUserRole, deleteUser, getAllUsers, getOneUser, removeUserRole, updateUser } from '../routes/user.js';
import { checkRole } from '../utils/context.js';
import { getPagination } from '../utils/pagnination.js';
import type { Variables } from '../validators/general.js';
import { Role } from '../validators/general.js';

export const user = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

user.openapi(getAllUsers, async (c) => {
  const roles = c.get('user').roles;
  checkRole(roles, false, [Role.ADMIN]);
  const { skip, take } = c.req.valid('query');
  const { from, to } = getPagination(skip, take - 1);
  const { data, error } = await supabase.from('USERS').select('*').range(from, to);

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json(data, 200);
});

user.openapi(getOneUser, async (c) => {
  const roles = c.get('user').roles || [];
  await checkRole(roles, true);
  const { id } = c.req.valid('param');
  const { data, error } = await supabase.from('USERS').select('*').eq('id', id).single();

  if (error || !data) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json(data, 200);
});

user.openapi(updateUser, async (c) => {
  const { id } = c.req.valid('param');
  const { first_name, last_name, username } = c.req.valid('json');
  const user = c.get('user');
  const roles = c.get('user').roles || [];
  await checkRole(roles, true);

  if (roles?.includes(Role.MODERATOR || Role.ADMIN || Role.DIRECTOR)) {
    const { data, error } = await supabase
      .from('USERS')
      .update({ first_name, last_name, username })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return c.json({ error: error?.message || 'Failed to update user' }, 500);
    }

    return c.json(data, 200);
  }
  if (user.id !== id) return c.json({ error: 'You can only update your own profile' }, 403);

  const { data, error } = await supabase
    .from('USERS')
    .update({ first_name, last_name, username })
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: error?.message || 'Failed to update user' }, 500);
  }

  return c.json(data, 200);
});

user.openapi(addUserRole, async (c) => {
  const { id } = c.req.valid('param');
  const { id_role } = c.req.valid('json');
  const roles = c.get('user').roles || [];
  await checkRole(roles, false, [Role.ADMIN]);

  const { data, error } = await supabase.from('USERS_ROLES').insert({ id_user: id, id_role }).single();

  if (error || !data) {
    return c.json({ error: error?.message || 'Failed to add role' }, 500);
  }

  return c.json(data, 200);
});

user.openapi(removeUserRole, async (c) => {
  const { id } = c.req.valid('param');
  const { id_role } = c.req.valid('json');
  const roles = c.get('user').roles || [];
  await checkRole(roles, false, [Role.ADMIN]);

  const { data, error } = await supabase.from('USERS_ROLES').delete().eq('id_user, id_role', [id, id_role]).single();

  if (error || !data) {
    return c.json({ error: error?.message || 'Failed to remove role' }, 500);
  }

  return c.json(data, 200);
});

user.openapi(deleteUser, async (c) => {
  const { id } = c.req.valid('param');
  const roles = c.get('user').roles || [];
  await checkRole(roles, false, [Role.ADMIN]);

  const { data: user_data, error: errorID } = await supabase.from('USERS').select('id_auth').eq('id', id).single();

  if (errorID || !user_data) {
    return c.json({ error: errorID?.message || 'Failed to fetch user data' }, 400);
  }

  const { data, error } = await supabase.from('USERS').delete().eq('id', id).single();

  if (error || !data) {
    return c.json({ error: error?.message || 'Failed to delete user' }, 500);
  }

  const { error: errorAuth } = await supabase.auth.admin.deleteUser(user_data.id_auth ? user_data.id_auth : '');

  if (errorAuth) {
    return c.json({ error: errorAuth.message || 'Failed to delete user' }, 500);
  }

  return c.json(data, 200);
});
