import { OpenAPIHono } from '@hono/zod-openapi';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import {
  createActivity,
  deleteActivity,
  getAllActivities,
  getOneActivity,
  updateActivity,
} from '../routes/activities.js';
import { checkRole } from '../utils/context.js';
import { getPagination } from '../utils/pagnination.js';
import type { Variables } from '../validators/general.js';

export const activities = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

activities.openapi(getAllActivities, async (c) => {
  const { skip, take } = c.req.valid('query');
  const { from, to } = getPagination(skip, take - 1);
  const { data, error } = await supabase.from('ACTIVITIES').select('*').range(from, to);

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json(data, 200);
});

activities.openapi(getOneActivity, async (c) => {
  const { id } = c.req.valid('param');
  const { data, error } = await supabase.from('ACTIVITIES').select('*').eq('id', id).single();

  if (error || !data) {
    return c.json({ error: 'Activity not found' }, 404);
  }

  return c.json(data, 200);
});

activities.openapi(createActivity, async (c) => {
  const { name, max_participants, duration_minute, id_sport, id_address } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { data, error } = await supabase
    .from('ACTIVITIES')
    .insert({ name, max_participants, duration_minute, id_sport, id_address })
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: 'Failed to create activity' }, 400);
  }

  return c.json(data, 201);
});

activities.openapi(updateActivity, async (c) => {
  const { id } = c.req.valid('param');
  const { name, max_participants, duration_minute, id_sport, id_address } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { data, error } = await supabase
    .from('ACTIVITIES')
    .update({ name, max_participants, duration_minute, id_sport, id_address })
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: 'Failed to update activity' }, 400);
  }

  return c.json(data, 200);
});

activities.openapi(deleteActivity, async (c) => {
  const { id } = c.req.valid('param');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { data, error } = await supabase.from('ACTIVITIES').delete().eq('id', id).single();

  if (error || !data) {
    return c.json({ error: 'Activity not found' }, 404);
  }

  return c.json(data, 200);
});
