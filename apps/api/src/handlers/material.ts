import { OpenAPIHono } from '@hono/zod-openapi';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import {
  addMaterial,
  changeMaterialQuantity,
  createMaterial,
  deleteMaterial,
  getAllMaterials,
  getMaterialById,
  removeMaterial,
  updateMaterial,
} from '../routes/material.js';
import { checkRole } from '../utils/context.js';
import type { Variables } from '../validators/general.js';
import { Role } from '../validators/general.js';

export const material = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

material.openapi(getAllMaterials, async (c) => {
  const { all, search, addresses } = c.req.valid('query');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false, [Role.ADMIN]);

  let materialIds = null;

  if (!all) {
    const { data: addressData, error: addressError } = await supabase
      .from('ADDRESSES_MATERIALS')
      .select('id_material')
      .in('id_address', addresses);

    if (addressError) {
      return c.json({ error: addressError.message }, 500);
    }

    materialIds = addressData.map((ad) => ad.id_material);
  }

  let query = supabase
    .from('MATERIALS')
    .select('*, addresses:ADDRESSES_MATERIALS (id_address, quantity)', { count: 'exact' })
    .order('id', { ascending: true });

  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  if (materialIds) {
    query = query.in('id', materialIds);
  }

  const { data, error, count } = await query;

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  const formattedData = data.map((material) => {
    const { addresses, ...rest } = material;
    return {
      ...rest,
      id_address: addresses?.[0]?.id_address ?? 0,
      quantity: addresses?.reduce((acc, { quantity }) => acc + quantity, 0) ?? 0,
    };
  });

  const responseData = {
    data: formattedData || [],
    count: count || 0,
  };

  return c.json(responseData, 200);
});

material.openapi(getMaterialById, async (c) => {
  const { id } = c.req.valid('param');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { data, error } = await supabase
    .from('MATERIALS')
    .select('*, addresses:ADDRESSES_MATERIALS (id_address, quantity)')
    .eq('id', id)
    .single();

  if (error || !data) {
    return c.json({ error: 'Material not found' }, 404);
  }

  if (!data.addresses[0]) {
    return c.json({ error: 'Material not found' }, 404);
  }

  const formattedData = {
    id: data.id,
    name: data.name,
    weight_grams: data.weight_grams,
    id_address: data.addresses[0].id_address,
    quantity: data.addresses.reduce((acc, { quantity }) => acc + quantity, 0),
  };

  return c.json(formattedData, 200);
});

material.openapi(createMaterial, async (c) => {
  const { name, weight_grams } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { data, error } = await supabase.from('MATERIALS').insert([{ name, weight_grams }]).select().single();

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json(data, 201);
});

material.openapi(updateMaterial, async (c) => {
  const { id } = c.req.valid('param');
  const { name, weight_grams } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { data, error } = await supabase
    .from('MATERIALS')
    .update({ name, weight_grams })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json(data, 200);
});

material.openapi(deleteMaterial, async (c) => {
  const { id } = c.req.valid('param');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { error } = await supabase.from('MATERIALS').delete().eq('id', id);

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({ message: 'Material deleted' }, 200);
});

material.openapi(changeMaterialQuantity, async (c) => {
  const { id } = c.req.valid('param');
  const { quantity, id_address } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { data, error } = await supabase
    .from('ADDRESSES_MATERIALS')
    .update({ quantity })
    .eq('id_material', id)
    .eq('id_address', id_address);

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({ message: 'Quantity updated' }, 200);
});

material.openapi(addMaterial, async (c) => {
  const { id } = c.req.valid('param');
  const { id_address, quantity } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { data, error } = await supabase
    .from('ADDRESSES_MATERIALS')
    .insert([{ id_material: id, id_address, quantity }]);

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({ message: 'Material added' }, 201);
});

material.openapi(removeMaterial, async (c) => {
  const { id } = c.req.valid('param');
  const { id_address } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { error } = await supabase
    .from('ADDRESSES_MATERIALS')
    .delete()
    .eq('id_material', id)
    .eq('id_address', id_address);

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({ message: 'Material removed' }, 200);
});
