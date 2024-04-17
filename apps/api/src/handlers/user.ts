import { OpenAPIHono } from '@hono/zod-openapi';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import { changeUserRole, deleteUser, getAllUsers, getOneUser, updateUser } from '../routes/user.js';
import { checkRole } from '../utils/context.js';
import { getPagination } from '../utils/pagnination.js';
import type { Variables } from '../validators/general.js';
import { Role } from '../validators/general.js';

export const user = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

user.openapi(getAllUsers, async (c) => {
  const id_role = c.get('user').id_role;
  await checkRole(id_role, false, [Role.ADMIN]);
  const { skip, take } = c.req.valid('query');
  const { from, to } = getPagination(skip, take - 1);
  const { data, error } = await supabase.from('USERS').select('*').range(from, to);

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json(data, 200);
});

user.openapi(getOneUser, async (c) => {
  const id_role = c.get('user').id_role;
  await checkRole(id_role, true);
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
  await checkRole(user.id_role, true);

  if (user.id_role <= Role.ADMIN) {
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

user.openapi(changeUserRole, async (c) => {
  const { id } = c.req.valid('param');
  const { id_role } = c.req.valid('json');
  const user = c.get('user');
  await checkRole(user.id_role, false, [Role.ADMIN]);

  const { data, error } = await supabase.from('USERS').update({ id_role }).eq('id', id).select().single();

  if (error || !data) {
    return c.json({ error: error?.message || 'Failed to update user' }, 500);
  }

  return c.json(data, 200);
});

user.openapi(deleteUser, async (c) => {
  const { id } = c.req.valid('param');
  const user = c.get('user');
  await checkRole(user.id_role, false, [Role.ADMIN]);

  const { data, error } = await supabase.from('USERS').delete().eq('id', id).single();

  if (error || !data) {
    return c.json({ error: error?.message || 'Failed to delete user' }, 500);
  }

  return c.json(data, 200);
});
