import { OpenAPIHono } from '@hono/zod-openapi';
import type { PostgrestError } from '@supabase/supabase-js';
import { sendInvoiceEmail, sendNewsletterSubscriptionEmail } from '../libs/email.js';
import { type User, buildHierarchy } from '../libs/hiearchy.js';
import { supAdmin, supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import {
  addUserRole,
  deleteUser,
  getAllUsers,
  getHierarchy,
  getMe,
  getOneUser,
  getUserInvoice,
  getUsersActivities,
  removeUserRole,
  setStatus,
  softDeleteUser,
  subscribeNewsletter,
  updateUser,
  updateUserRole,
} from '../routes/users.js';
import { checkBanned, checkRole } from '../utils/context.js';
import { getPagination } from '../utils/pagnination.js';
import type { Variables } from '../validators/general.js';
import { Role } from '../validators/general.js';

export const users = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

users.openapi(getAllUsers, async (c) => {
  const roles = c.get('user').roles;
  await checkRole(roles, false, [Role.ADMIN]);
  const { search, all, skip, take, role } = c.req.valid('query');

  const query = supabase
    .from('USERS')
    .select('*, roles:ROLES(id, name)', { count: 'exact' })
    .filter('deleted_at', 'is', null)
    .order('created_at', { ascending: true });

  if (search) {
    query.ilike('username', `%${search}%`);
  }

  if (!all) {
    const { from, to } = getPagination(skip, take - 1);
    query.range(from, to);
  }

  let { data, error, count } = await query;

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  if (role) {
    const { data: roleFound } = await supabase.from('ROLES').select('id').eq('name', role.toUpperCase()).single();

    if (!roleFound) {
      return c.json({ error: 'Role not found in query' }, 404);
    }
    data = data?.filter((user) => user.roles.some((userRole) => userRole.id === roleFound.id)) || [];
  }

  const responseData = {
    data: data || [],
    count: count || 0,
  };

  return c.json(responseData, 200);
});

users.openapi(getMe, async (c) => {
  const user = c.get('user');
  await checkBanned(user.roles);
  const { data, error } = await supabase
    .from('USERS')
    .select('*, roles:ROLES (id, name)')
    .eq('id', user.id)
    .filter('deleted_at', 'is', null)
    .single();

  if (error || !data) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json(data, 200);
});

users.openapi(getHierarchy, async (c) => {
  const roles = c.get('user').roles;
  await checkRole(roles, true);
  const selectedRoles = [
    'PRESIDENT',
    'SECRETARY',
    'VICE_PRESIDENT',
    'TREASURER',
    'REDACTOR',
    'PROJECT_MANAGER',
    'COMMUNICATION_OFFICER',
  ];

  const { data, error } = await supabase
    .from('USERS')
    .select('*, roles:ROLES!inner(id, name)')
    .filter('deleted_at', 'is', null)
    .in('roles.name', selectedRoles);

  if (error || !data) {
    return c.json({ error: 'Hierarchy not found' }, 404);
  }

  const hierarchy = buildHierarchy(data as unknown as User[]);
  if (!hierarchy) {
    return c.json({ error: 'Hierarchy not found' }, 404);
  }

  return c.json(hierarchy, 200);
});

users.openapi(subscribeNewsletter, async (c) => {
  const { email } = c.req.valid('json');

  const { data, error: errorID } = await supabase
    .from('USERS')
    .select('id, deleted_at, newsletter')
    .eq('email', email)
    .single();
  if (errorID || !data) {
    return c.json({ error: 'User not found' }, 404);
  }

  if (data.deleted_at) {
    return c.json({ error: 'The user was deleted' }, 400);
  }

  if (data.newsletter) {
    return c.json({ message: 'Already subscribed' }, 200);
  }

  const { error } = await supabase.from('USERS').update({ newsletter: true }).eq('id', data.id);

  if (error) {
    return c.json({ error: 'Failed to subscribe' }, 400);
  }

  if (process.env.ENABLE_EMAILS === 'true') {
    await sendNewsletterSubscriptionEmail(email);
  }

  return c.json({ message: 'Subscribed to newsletter' }, 200);
});

users.openapi(getUserInvoice, async (c) => {
  const user = c.get('user');
  const roles = user.roles || [];
  await checkRole(roles, true);
  const { data, error } = await supabase.from('USERS').select('invoice').eq('id', user.id).single();

  if (error || !data) {
    return c.json({ error: 'Invoice not found' }, 404);
  }

  if (data.invoice && process.env.ENABLE_EMAILS === 'true') {
    await sendInvoiceEmail(data.invoice, user.email);
  }

  return c.json(data, 200);
});

users.openapi(getOneUser, async (c) => {
  const roles = c.get('user').roles || [];
  await checkRole(roles, true);
  const { id } = c.req.valid('param');
  const { data, error } = await supabase
    .from('USERS')
    .select('*, roles:ROLES (id, name)')
    .eq('id', id)
    .filter('deleted_at', 'is', null)
    .single();

  if (error || !data) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json(data, 200);
});

users.openapi(updateUser, async (c) => {
  const { id } = c.req.valid('param');
  const { first_name, last_name, username } = c.req.valid('json');
  const user = c.get('user');
  const roles = c.get('user').roles || [];
  await checkBanned(roles);

  const allowed = [Role.MODERATOR, Role.ADMIN, Role.PRESIDENT];
  if (roles?.some((role) => allowed.includes(role))) {
    const { data: dataExist, error: errorExist } = await supabase
      .from('USERS')
      .select('id, deleted_at')
      .eq('id', id)
      .single();

    if (errorExist || !dataExist) {
      return c.json({ error: 'User not found' }, 404);
    }

    if (dataExist.deleted_at) {
      return c.json({ error: 'The user was deleted' }, 400);
    }

    const { data, error } = await supabase
      .from('USERS')
      .update({ first_name, last_name, username })
      .eq('id', id)
      .select('*, roles:ROLES (id, name)')
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
    .select('*, roles:ROLES (id, name)')
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

  const { data, error: errorID } = await supabase.from('USERS').select('id, deleted_at').eq('id', id).single();

  if (errorID || !data) {
    return c.json({ error: 'User not found' }, 404);
  }

  if (data.deleted_at) {
    return c.json({ error: 'The user was deleted' }, 400);
  }

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

  const { data, error: errorID } = await supabase.from('USERS').select('id, deleted_at').eq('id', id).single();

  if (errorID || !data) {
    return c.json({ error: 'User not found' }, 404);
  }

  if (data.deleted_at) {
    return c.json({ error: 'The user was deleted' }, 400);
  }

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

users.openapi(updateUserRole, async (c) => {
  const { id } = c.req.valid('param');
  const { roles } = c.req.valid('json');
  const userRoles = c.get('user').roles || [];
  await checkRole(userRoles, false, [Role.ADMIN]);

  const { data, error: errorID } = await supabase.from('USERS').select('id, deleted_at').eq('id', id).single();

  if (errorID || !data) {
    return c.json({ error: 'User not found' }, 404);
  }

  if (data.deleted_at) {
    return c.json({ error: 'The user was deleted' }, 400);
  }

  const { error } = await supabase.from('USERS_ROLES').delete().eq('id_user', id);

  if (error) {
    return c.json({ error: 'Failed to update roles' }, 400);
  }

  if (!roles || roles.length === 0) {
    return c.json({ message: 'Roles updated' }, 200);
  }

  const insert = roles.map((id_role) => ({ id_user: id, id_role }));
  const { error: errorInsert } = await supabase.from('USERS_ROLES').insert(insert);

  if (errorInsert) {
    return c.json({ error: 'Failed to update roles' }, 400);
  }

  return c.json({ message: 'Roles updated' }, 200);
});

users.openapi(softDeleteUser, async (c) => {
  const { id } = c.req.valid('param');
  const roles = c.get('user').roles || [];
  await checkRole(roles, false, [Role.ADMIN]);

  const { data: user_data, error: errorID } = await supabase
    .from('USERS')
    .select('id, deleted_at, id_auth')
    .eq('id', id)
    .single();

  if (errorID || !user_data) {
    return c.json({ error: 'User not found' }, 404);
  }

  if (user_data.deleted_at) {
    return c.json({ error: 'User already deleted' }, 400);
  }

  const { error: errorRole } = await supabase.from('USERS_ROLES').delete().eq('id_user', id);

  if (errorRole) {
    return c.json({ error: 'Failed to delete user' }, 500);
  }

  const { error } = await supabase
    .from('USERS')
    .update({
      username: 'Deleted',
      first_name: 'Deleted',
      last_name: 'Deleted',
      email: `Deleted${user_data.id}`,
      date_validity: null,
      deleted_at: new Date().toISOString(),
      id_auth: null,
    })
    .eq('id', id);

  if (error) {
    return c.json({ error: 'Failed to delete user' }, 500);
  }

  if (user_data?.id_auth) {
    await supAdmin.auth.admin.deleteUser(user_data.id_auth);
  }

  return c.json({ message: 'User deleted' }, 200);
});

users.openapi(getUsersActivities, async (c) => {
  const roles = c.get('user').roles || [];
  await checkRole(roles, true);
  const user = c.get('user');
  const { skip, take } = c.req.valid('query');
  const { from, to } = getPagination(skip, take - 1);

  const { data, error, count } = await supabase
    .from('ACTIVITIES_USERS')
    .select('*, activity:ACTIVITIES(*)', { count: 'exact' })
    .eq('id_user', user.id)
    .range(from, to);

  if (error) {
    return c.json({ error: 'User not found' }, 404);
  }

  const responseData = {
    data: data || [],
    count: count || 0,
  };

  return c.json(responseData, 200);
});

users.openapi(setStatus, async (c) => {
  const { id } = c.req.valid('param');
  const { status } = c.req.valid('json');
  const roles = c.get('user').roles || [];
  await checkRole(roles, false, [Role.ADMIN]);

  const { data, error: errorID } = await supabase.from('USERS').select('id, deleted_at').eq('id', id).single();

  if (errorID || !data) {
    return c.json({ error: 'User not found' }, 404);
  }

  if (data.deleted_at) {
    return c.json({ error: 'The user was deleted' }, 400);
  }

  if (!['applied', 'approved', 'rejected'].includes(status)) {
    return c.json({ error: 'Invalid subscription' }, 400);
  }

  let error: PostgrestError | null;

  if (status === 'approved') {
    const oneYear = new Date();
    oneYear.setFullYear(oneYear.getFullYear() + 1);
    ({ error } = await supabase.from('USERS').update({ status, date_validity: oneYear.toISOString() }).eq('id', id));
  } else {
    ({ error } = await supabase.from('USERS').update({ status }).eq('id', id));
  }

  if (error) {
    return c.json({ error: 'Failed to update status' }, 400);
  }

  if (status === 'approved') {
    const { error } = await supabase.from('USERS_ROLES').insert([{ id_user: id, id_role: 2 }]);

    if (error) {
      return c.json({ error: 'Failed to update subscription' }, 400);
    }
  }

  return c.json({ message: 'Status updated' }, 200);
});
