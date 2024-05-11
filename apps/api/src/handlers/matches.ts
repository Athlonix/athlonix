import { OpenAPIHono } from '@hono/zod-openapi';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import {
  createMatch,
  deleteMatch,
  getAllMatches,
  getMatchById,
  updateMatch,
  updateMatchWinner,
} from '../routes/matches.js';
import { checkRole } from '../utils/context.js';
import { getPagination } from '../utils/pagnination.js';
import type { Variables } from '../validators/general.js';

export const matches = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

matches.openapi(getAllMatches, async (c) => {
  const { search, all, skip, take } = c.req.valid('query');

  const query = supabase
    .from('MATCHES')
    .select('*, teams_matches(winner) as winner', { count: 'exact' })
    .order('id', { ascending: true });

  if (search) {
    query.ilike('name', `%${search}%`);
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

matches.openapi(getMatchById, async (c) => {
  const { id } = c.req.valid('param');
  const { data, error } = await supabase.from('MATCHES').select('*').eq('id', id).single();

  if (error || !data) {
    return c.json({ error: 'Match not found' }, 404);
  }

  return c.json(data, 200);
});

matches.openapi(createMatch, async (c) => {
  const { start_time, end_time } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { data, error } = await supabase.from('MATCHES').insert({ start_time, end_time });

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json(data, 200);
});

matches.openapi(updateMatch, async (c) => {
  const { id } = c.req.valid('param');
  const { start_time, end_time } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { data, error } = await supabase.from('MATCHES').update({ start_time, end_time }).eq('id', id);

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json(data, 200);
});

matches.openapi(updateMatchWinner, async (c) => {
  const { id } = c.req.valid('param');
  const { idTeam, winner } = c.req.valid('query');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { data, error } = await supabase.from('TEAMS_MATCHES').update({ id_team: idTeam, winner }).eq('id_match', id);

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json(data, 200);
});

matches.openapi(deleteMatch, async (c) => {
  const { id } = c.req.valid('param');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { data, error } = await supabase.from('MATCHES').delete().eq('id', id);

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json(data, 200);
});
