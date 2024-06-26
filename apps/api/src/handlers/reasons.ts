import { OpenAPIHono } from '@hono/zod-openapi';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import { createReason, deleteReason, getReasonById, getReasons, updateReason } from '../routes/reasons.js';
import { checkRole } from '../utils/context.js';
import type { Variables } from '../validators/general.js';
import { Role } from '../validators/general.js';

export const reasons = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

reasons.openapi(getReasons, async (c) => {
  const query = supabase.from('REASONS').select('*').order('id', { ascending: true });
  const { data, error } = await query;

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json(data, 200);
});

reasons.openapi(getReasonById, async (c) => {
  const { id } = c.req.valid('param');
  const { data, error } = await supabase.from('REASONS').select('*').eq('id', id).single();

  if (error || !data) {
    return c.json({ error: 'Reason not found' }, 404);
  }

  return c.json(data, 200);
});

reasons.openapi(createReason, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false, [Role.ADMIN]);

  const { reason } = c.req.valid('json');
  const { data, error } = await supabase.from('REASONS').insert({ reason }).select().single();

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json(data, 200);
});

reasons.openapi(updateReason, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false, [Role.ADMIN]);

  const { id } = c.req.valid('param');
  const { reason } = c.req.valid('json');
  const { data, error } = await supabase.from('REASONS').update({ reason }).eq('id', id).select().single();

  if (error) {
    return c.json({ error: error.message }, 404);
  }

  return c.json(data, 200);
});

reasons.openapi(deleteReason, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false, [Role.ADMIN]);

  const { id } = c.req.valid('param');

  const { data: existingReason, error: fetchError } = await supabase.from('REASONS').select('id').eq('id', id).single();

  if (fetchError || !existingReason) {
    return c.json({ error: 'Reason not found' }, 404);
  }

  const { error: deleteError } = await supabase.from('REASONS').delete().eq('id', id);

  if (deleteError) {
    return c.json({ error: deleteError.message }, 500);
  }

  return c.json({ message: 'Reason deleted' }, 200);
});
