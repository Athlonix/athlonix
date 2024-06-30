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
} from '../routes/materials.js';
import { checkRole } from '../utils/context.js';
import type { Variables } from '../validators/general.js';
import { Role } from '../validators/general.js';

export const materials = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

materials.openapi(getAllMaterials, async (c) => {
  const { all, search, addresses } = c.req.valid('query');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false, [Role.ADMIN]);

  let materialIds: number[] | null = null;

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

  const query = supabase
    .from('MATERIALS')
    .select('*, addresses:ADDRESSES_MATERIALS (id_address, quantity)', { count: 'exact' })
    .order('id', { ascending: true });

  if (search) {
    query.ilike('name', `%${search}%`);
  }

  if (materialIds) {
    query.in('id', materialIds);
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

materials.openapi(getMaterialById, async (c) => {
  const { id } = c.req.valid('param');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { data, error } = await supabase
    .from('MATERIALS')
    .select('*, addresses:ADDRESSES_MATERIALS (id_address, quantity)')
    .eq('id', id)
    .single();

  if (error || !data || !data.addresses[0]) {
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

materials.openapi(createMaterial, async (c) => {
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

materials.openapi(updateMaterial, async (c) => {
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

  if (error || !data) {
    return c.json({ error: 'Material not found' }, 404);
  }

  return c.json(data, 200);
});

materials.openapi(deleteMaterial, async (c) => {
  const { id } = c.req.valid('param');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { error, count } = await supabase.from('MATERIALS').delete({ count: 'exact' }).eq('id', id);

  if (error || count === 0) {
    return c.json({ error: 'Material not found' }, 404);
  }

  return c.json({ message: 'Material deleted' }, 200);
});

materials.openapi(changeMaterialQuantity, async (c) => {
  const { id } = c.req.valid('param');
  const { quantity, id_address } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { error } = await supabase
    .from('ADDRESSES_MATERIALS')
    .update({ quantity })
    .eq('id_material', id)
    .eq('id_address', id_address);

  if (error) {
    return c.json({ error: "Material or address doesn't exist" }, 404);
  }

  return c.json({ message: 'Quantity updated' }, 200);
});

materials.openapi(addMaterial, async (c) => {
  const { id } = c.req.valid('param');
  const { id_address, quantity } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { error } = await supabase.from('ADDRESSES_MATERIALS').insert([{ id_material: id, id_address, quantity }]);

  if (error) {
    return c.json({ error: "Material or address doesn't exist" }, 404);
  }

  return c.json({ message: 'Material added' }, 201);
});

materials.openapi(removeMaterial, async (c) => {
  const { id } = c.req.valid('param');
  const { id_address } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { error, count } = await supabase
    .from('ADDRESSES_MATERIALS')
    .delete({ count: 'exact' })
    .eq('id_material', id)
    .eq('id_address', id_address);

  if (error || count === 0) {
    return c.json({ error: 'Material not found' }, 404);
  }

  return c.json({ message: 'Material removed' }, 200);
});
