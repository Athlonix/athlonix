import { OpenAPIHono } from '@hono/zod-openapi';
import { supAdmin, supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import {
  addUserRole,
  deleteUser,
  getAllUsers,
  getOneUser,
  getUsersActivities,
  removeUserRole,
  updateUser,
} from '../routes/users.js';
import { checkRole } from '../utils/context.js';
import { getPagination } from '../utils/pagnination.js';
import type { Variables } from '../validators/general.js';
import { Role } from '../validators/general.js';

export const users = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

users.openapi(getAllUsers, async (c) => {
  const roles = c.get('user').roles;
  await checkRole(roles, false, [Role.ADMIN]);
  const { skip, take } = c.req.valid('query');
  const { from, to } = getPagination(skip, take - 1);
  const { data, error } = await supabase.from('USERS').select('*, roles:USERS_ROLES(id_role)').range(from, to);

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  const format = data.map((user) => {
    return {
      ...user,
      roles: user.roles.map((role) => role.id_role),
    };
  });

  return c.json(format, 200);
});

users.openapi(getOneUser, async (c) => {
  const roles = c.get('user').roles || [];
  await checkRole(roles, true);
  const { id } = c.req.valid('param');
  const { data, error } = await supabase.from('USERS').select('*, roles:USERS_ROLES(id_role)').eq('id', id).single();

  if (error || !data) {
    return c.json({ error: 'User not found' }, 404);
  }

  const format = {
    ...data,
    roles: data.roles.map((role: { id_role: number }) => role.id_role),
  };

  return c.json(format, 200);
});

users.openapi(updateUser, async (c) => {
  const { id } = c.req.valid('param');
  const { first_name, last_name, username } = c.req.valid('json');
  const user = c.get('user');
  const roles = c.get('user').roles || [];
  await checkRole(roles, true);

  const allowed = [Role.MODERATOR, Role.ADMIN, Role.DIRECTOR];
  if (roles?.some((role) => allowed.includes(role))) {
    const { data, error } = await supabase
      .from('USERS')
      .update({ first_name, last_name, username })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return c.json({ error: error?.message || 'Failed to update user' }, 400);
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
    return c.json({ error: 'Failed to update user' }, 400);
  }

  return c.json(data, 200);
});

users.openapi(addUserRole, async (c) => {
  const { id } = c.req.valid('param');
  const { id_role } = c.req.valid('json');
  const roles = c.get('user').roles || [];
  await checkRole(roles, false, [Role.ADMIN]);

  const { error } = await supabase.from('USERS_ROLES').insert({ id_user: id, id_role });

  if (error) {
    return c.json({ error: 'Failed to add role' }, 400);
  }

  return c.json({ message: 'Role added' }, 201);
});

users.openapi(removeUserRole, async (c) => {
  const { id } = c.req.valid('param');
  const { id_role } = c.req.valid('json');
  const roles = c.get('user').roles || [];
  await checkRole(roles, false, [Role.ADMIN]);

  const { error } = await supabase.from('USERS_ROLES').delete().eq('id_user', id).eq('id_role', id_role);

  if (error) {
    return c.json({ error: 'Failed to remove role' }, 400);
  }

  return c.json({ message: 'Role removed' }, 200);
});

users.openapi(deleteUser, async (c) => {
  const { id } = c.req.valid('param');
  const roles = c.get('user').roles || [];
  await checkRole(roles, false, [Role.ADMIN]);

  const { data: user_data, error: errorID } = await supabase.from('USERS').select('id_auth').eq('id', id).single();

  if (errorID || !user_data) {
    return c.json({ error: 'User not found' }, 404);
  }

  const { error } = await supabase.from('USERS').delete().eq('id', id);

  if (error) {
    return c.json({ error: 'Failed to delete user' }, 500);
  }

  const { error: errorAuth } = await supAdmin.auth.admin.deleteUser(user_data.id_auth ? user_data.id_auth : '');
  if (errorAuth) {
    return c.json({ error: 'Failed to delete user' }, 500);
  }

  return c.json({ message: 'User deleted' }, 200);
});

users.openapi(getUsersActivities, async (c) => {
  const roles = c.get('user').roles || [];
  await checkRole(roles, true);
  const user = c.get('user');
  const { skip, take } = c.req.valid('query');
  const { from, to } = getPagination(skip, take - 1);

  const { data, error } = await supabase
    .from('ACTIVITIES_USERS')
    .select('*, activity:ACTIVITIES(*)')
    .eq('id_user', user.id)
    .range(from, to);

  if (error) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json(data, 200);
});
