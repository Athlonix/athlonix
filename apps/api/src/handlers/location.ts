import { OpenAPIHono } from '@hono/zod-openapi';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import { createAddress, deleteAddress, getAllAddresses, getOneAddress, updateAddress } from '../routes/locations.js';
import { checkRole } from '../utils/context.js';
import { getPagination } from '../utils/pagnination.js';
import type { Variables } from '../validators/general.js';

export const location = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

location.openapi(getAllAddresses, async (c) => {
  const { all, search, skip, take } = c.req.valid('query');

  const query = supabase.from('ADDRESSES').select('*', { count: 'exact' }).order('id', { ascending: true });

  if (search) {
    query.ilike('road', `%${search}%`);
  }

  if (!all) {
    const { from, to } = getPagination(skip, take - 1);
    query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  const responseData = {
    data: data || [],
    count: count || 0,
  };

  return c.json(responseData, 200);
});

location.openapi(getOneAddress, async (c) => {
  const { id } = c.req.valid('param');
  const { data, error } = await supabase.from('ADDRESSES').select('*').eq('id', id).single();

  if (error || !data) {
    return c.json({ error: 'Address not found' }, 404);
  }

  return c.json(data, 200);
});

location.openapi(createAddress, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);
  const { road, postal_code, complement, city, number, name, id_lease } = c.req.valid('json');
  const { data, error } = await supabase
    .from('ADDRESSES')
    .insert({ road, postal_code, complement, city, number, name, id_lease })
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: 'Failed to create address' }, 400);
  }

  return c.json(data, 201);
});

location.openapi(updateAddress, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);
  const { id } = c.req.valid('param');
  const { road, postal_code, complement, city, number, name, id_lease } = c.req.valid('json');
  const { data, error } = await supabase
    .from('ADDRESSES')
    .update({ road, postal_code, complement, city, number, name, id_lease })
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: 'Failed to update address' }, 500);
  }

  return c.json(data, 200);
});

location.openapi(deleteAddress, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);
  const { id } = c.req.valid('param');

  const { data: existingAddress, error: fetchError } = await supabase
    .from('ADDRESSES')
    .select('id')
    .eq('id', id)
    .single();

  if (fetchError || !existingAddress) {
    return c.json({ error: 'Address not found' }, 404);
  }

  const { error: deleteError } = await supabase.from('ADDRESSES').delete().eq('id', id);

  if (deleteError) {
    return c.json({ error: deleteError.message }, 500);
  }

  return c.json({ message: 'Address deleted' }, 200);
});
