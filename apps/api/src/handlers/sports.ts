import { OpenAPIHono } from '@hono/zod-openapi';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import { createSport, deleteSport, getAllSports, getOneSport, updateSport } from '../routes/sports.js';
import { checkRole } from '../utils/context.js';
import { getPagination } from '../utils/pagnination.js';
import type { Variables } from '../validators/general.js';

export const sports = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

sports.openapi(getAllSports, async (c) => {
  const { search, all, skip, take } = c.req.valid('query');
  const searchTerm = search || '';

  if (all) {
    const { data, error, count } = await supabase
      .from('SPORTS')
      .select('*', { count: 'exact' })
      .order('id', { ascending: true })
      .ilike('name', `%${searchTerm}%`);

    if (error) {
      return c.json({ error: error.message }, 500);
    }

    const responseData = {
      data: data || [],
      count: count || 0,
    };

    return c.json(responseData, 200);
  }

  const { from, to } = getPagination(skip, take - 1);
  const { data, error, count } = await supabase
    .from('SPORTS')
    .select('*', { count: 'exact' })
    .range(from, to)
    .order('id', { ascending: true })
    .ilike('name', `%${searchTerm}%`);

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  const responseData = {
    data: data || [],
    count: count || 0,
  };

  return c.json(responseData, 200);
});

sports.openapi(getOneSport, async (c) => {
  const { id } = c.req.valid('param');
  const { data, error } = await supabase.from('SPORTS').select('*').eq('id', id).single();

  if (error || !data) {
    return c.json({ error: 'Sport not found' }, 404);
  }

  return c.json(data, 200);
});

sports.openapi(createSport, async (c) => {
  const { name, description, min_players, max_players, image } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { data, error } = await supabase
    .from('SPORTS')
    .insert({ name, description, min_players, max_players, image })
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: 'Failed to create sport' }, 400);
  }

  return c.json(data, 201);
});

sports.openapi(updateSport, async (c) => {
  const { id } = c.req.valid('param');
  const { name, description, min_players, max_players, image } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { data, error } = await supabase
    .from('SPORTS')
    .update({ name, description, min_players, max_players, image })
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: 'Failed to update sport' }, 400);
  }

  return c.json(data, 200);
});

sports.openapi(deleteSport, async (c) => {
  const { id } = c.req.valid('param');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { data, error } = await supabase.from('SPORTS').delete().eq('id', id);

  if (error || !data) {
    return c.json({ error: 'Sport not found' }, 404);
  }

  return c.json(data, 200);
});
