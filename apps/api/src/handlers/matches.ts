import { OpenAPIHono } from '@hono/zod-openapi';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import {
  createMatch,
  createMatchTournament,
  deleteMatch,
  deleteMatchTournament,
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
    .select('*, winner:TEAMS_MATCHES(winner, id_team)', { count: 'exact' })
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

  const formattedData = data.map((item) => ({
    ...item,
    winner: item.winner.length > 0 ? (item.winner[0] ? item.winner[0] : null) : null,
  }));

  const responseData = {
    data: formattedData || [],
    count: count || 0,
  };

  return c.json(responseData, 200);
});

matches.openapi(getMatchById, async (c) => {
  const { id } = c.req.valid('param');
  const { data, error } = await supabase
    .from('MATCHES')
    .select('*, winner:TEAMS_MATCHES(winner, id_team)')
    .eq('id', id)
    .single();

  if (error || !data) {
    return c.json({ error: 'Match not found' }, 404);
  }

  const formattedData = {
    ...data,
    winner: data.winner.length > 0 ? (data.winner[0] ? data.winner[0] : null) : null,
  };

  return c.json(formattedData, 200);
});

matches.openapi(createMatch, async (c) => {
  const { start_time, end_time } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  if (start_time && end_time && start_time >= end_time)
    return c.json({ error: 'Start time must be before end time' }, 400);

  const { data, error } = await supabase.from('MATCHES').insert({ start_time, end_time }).select().single();

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json(data, 201);
});

matches.openapi(updateMatchWinner, async (c) => {
  const { id } = c.req.valid('param');
  const { idTeam, winner } = c.req.valid('query');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { error } = await supabase.from('TEAMS_MATCHES').update({ id_team: idTeam, winner }).eq('id_match', id);

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({ message: 'Match winner updated' }, 200);
});

matches.openapi(updateMatch, async (c) => {
  const { id } = c.req.valid('param');
  const { start_time, end_time } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  if (start_time >= end_time) return c.json({ error: 'Start time must be before end time' }, 400);

  const { data: matchData, error: matchError } = await supabase.from('MATCHES').select('*').eq('id', id).single();

  if (matchError || !matchData) {
    return c.json({ error: 'Match not found' }, 404);
  }

  if (matchData.start_time && new Date(matchData.start_time) < new Date()) {
    return c.json({ error: 'Match already started' }, 400);
  }

  if (matchData.end_time && new Date(matchData.end_time) < new Date()) {
    return c.json({ error: 'Match already ended' }, 400);
  }

  const { data, error } = await supabase
    .from('MATCHES')
    .update({ start_time, end_time })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json(data, 200);
});

matches.openapi(createMatchTournament, async (c) => {
  const { id, id_tournament } = c.req.valid('param');
  const { round } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { data, error } = await supabase
    .from('TOURNAMENTS_MATCHES')
    .insert({ id_match: id, id_tournament, round })
    .eq('id_match', id)
    .select()
    .single();

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json(data, 201);
});

matches.openapi(deleteMatchTournament, async (c) => {
  const { id, id_tournament } = c.req.valid('param');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { error } = await supabase
    .from('TOURNAMENTS_MATCHES')
    .delete()
    .eq('id_match', id)
    .eq('id_tournament', id_tournament);

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({ message: 'Match deleted from tournament' }, 200);
});

matches.openapi(deleteMatch, async (c) => {
  const { id } = c.req.valid('param');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { error } = await supabase.from('MATCHES').delete().eq('id', id);

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({ message: 'Match deleted' }, 200);
});
