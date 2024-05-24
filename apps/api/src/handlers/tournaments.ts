import { OpenAPIHono } from '@hono/zod-openapi';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import {
  createMatch,
  createRound,
  createTeams,
  createTournament,
  deleteMatch,
  deleteRound,
  deleteTeam,
  deleteTournament,
  getAllMatches,
  getAllTournaments,
  getMatchById,
  getRoundById,
  getRounds,
  getTournamentById,
  getTournamentTeams,
  getTournamentTeamsById,
  joinTeam,
  leaveTeam,
  updateMatch,
  updateRound,
  updateTeam,
  updateTournament,
} from '../routes/tournaments.js';
import { checkRole } from '../utils/context.js';
import { getPagination } from '../utils/pagnination.js';
import type { Variables } from '../validators/general.js';

interface winnerAccumulator {
  [key: number]: number[];
}

export const tournaments = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

tournaments.openapi(getAllTournaments, async (c) => {
  const { search, all, skip, take, id_sport, id_address } = c.req.valid('query');

  const query = supabase.from('TOURNAMENTS').select('*', { count: 'exact' }).order('id', { ascending: true });

  if (search) {
    query.ilike('name', `%${search}%`);
  }

  if (id_sport) {
    query.eq('id_sport', id_sport);
  }

  if (id_address) {
    query.eq('id_address', id_address);
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

tournaments.openapi(getTournamentById, async (c) => {
  const { id } = c.req.valid('param');
  const { data, error } = await supabase.from('TOURNAMENTS').select('*').eq('id', id).single();

  if (error || !data) {
    return c.json({ error: 'Tournament not found' }, 404);
  }

  return c.json(data, 200);
});

tournaments.openapi(createTournament, async (c) => {
  const { name, default_match_length, max_participants, team_capacity, rules, prize, id_address } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { data, error } = await supabase
    .from('TOURNAMENTS')
    .insert({ name, default_match_length, max_participants, team_capacity, rules, prize, id_address })
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: 'Failed to create tournament' }, 500);
  }

  return c.json(data, 201);
});

tournaments.openapi(updateTournament, async (c) => {
  const { id } = c.req.valid('param');
  const { name, default_match_length, max_participants, team_capacity, rules, prize, id_address } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { data, error } = await supabase
    .from('TOURNAMENTS')
    .update({ name, default_match_length, max_participants, team_capacity, rules, prize, id_address })
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: 'Failed to update tournament' }, 500);
  }

  return c.json(data, 200);
});

tournaments.openapi(deleteTournament, async (c) => {
  const { id } = c.req.valid('param');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { error } = await supabase.from('TOURNAMENTS').delete().eq('id', id);

  if (error) {
    return c.json({ error: 'Failed to delete tournament' }, 500);
  }

  return c.json({ message: 'Tournament deleted' }, 200);
});

tournaments.openapi(getTournamentTeams, async (c) => {
  const { id } = c.req.valid('param');
  const { data, error, count } = await supabase.from('TEAMS').select('*', { count: 'exact' }).eq('id_tournament', id);

  if (error) {
    return c.json({ error: 'Tournament not found' }, 404);
  }

  const responseData = {
    data: data || [],
    count: count || 0,
  };

  return c.json(responseData, 200);
});

tournaments.openapi(getTournamentTeamsById, async (c) => {
  const { id, id_team } = c.req.valid('param');
  const { data, error } = await supabase.from('TEAMS').select('*').eq('id_tournament', id).eq('id', id_team).single();

  if (error || !data) {
    return c.json({ error: 'Team not found' }, 404);
  }

  return c.json(data, 200);
});

tournaments.openapi(createTeams, async (c) => {
  const { name } = c.req.valid('json');
  const { id } = c.req.valid('param');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { data, error } = await supabase.from('TEAMS').insert({ name, id_tournament: id }).select().single();

  if (error || !data) {
    return c.json({ error: 'Failed to create team' }, 400);
  }

  return c.json(data, 201);
});

tournaments.openapi(updateTeam, async (c) => {
  const { id, id_team } = c.req.valid('param');
  const { name } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { data, error } = await supabase
    .from('TEAMS')
    .update({ name })
    .eq('id', id_team)
    .eq('id_tournament', id)
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: 'Failed to update team' }, 500);
  }

  return c.json(data, 200);
});

tournaments.openapi(deleteTeam, async (c) => {
  const { id, id_team } = c.req.valid('param');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { error } = await supabase.from('TEAMS').delete().eq('id', id_team).eq('id_tournament', id);

  if (error) {
    return c.json({ error: 'Failed to delete team' }, 500);
  }

  return c.json({ message: 'Team deleted' }, 200);
});

tournaments.openapi(joinTeam, async (c) => {
  const { id, id_team } = c.req.valid('param');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, true);

  const { data: tournamentData, error: tournamentsError } = await supabase
    .from('TOURNAMENTS')
    .select('team_capacity, teams:TEAMS (id)')
    .eq('id', id)
    .single();

  if (tournamentsError || !tournamentData) {
    return c.json({ error: 'Tournament or team not found' }, 404);
  }

  if (tournamentData.teams.length >= tournamentData.team_capacity) {
    return c.json({ error: 'Team is full' }, 400);
  }

  const { data, error } = await supabase.from('USERS_TEAMS').insert({ id_team, id_user: user.id }).select().single();

  if (error || !data) {
    return c.json({ error: 'Failed to join team' }, 500);
  }

  return c.json(data, 200);
});

tournaments.openapi(leaveTeam, async (c) => {
  const { id, id_team } = c.req.valid('param');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, true);

  const { error } = await supabase.from('USERS_TEAMS').delete().eq('id_user', user.id).eq('id_team', id_team);

  if (error) {
    return c.json({ error: 'Failed to leave team' }, 500);
  }

  return c.json({ message: 'Team left' }, 200);
});

tournaments.openapi(getRounds, async (c) => {
  const { id } = c.req.valid('param');
  const { data, error, count } = await supabase
    .from('ROUNDS')
    .select('*', { count: 'exact' })
    .eq('id_tournament', id)
    .order('order', { ascending: true });

  if (error) {
    return c.json({ error: 'Tournament not found' }, 404);
  }

  const responseData = {
    data: data || [],
    count: count || 0,
  };

  return c.json(responseData, 200);
});

tournaments.openapi(getRoundById, async (c) => {
  const { id, id_round } = c.req.valid('param');
  const { data, error } = await supabase.from('ROUNDS').select('*').eq('id_tournament', id).eq('id', id_round).single();

  if (error || !data) {
    return c.json({ error: 'Round not found' }, 404);
  }

  return c.json(data, 200);
});

tournaments.openapi(createRound, async (c) => {
  const { name, order } = c.req.valid('json');
  const { id } = c.req.valid('param');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { data, error } = await supabase.from('ROUNDS').insert({ name, id_tournament: id, order }).select().single();

  if (error || !data) {
    return c.json({ error: 'Failed to create round' }, 400);
  }

  return c.json(data, 201);
});

tournaments.openapi(updateRound, async (c) => {
  const { id, id_round } = c.req.valid('param');
  const { name, order } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { data, error } = await supabase
    .from('ROUNDS')
    .update({ name, order })
    .eq('id', id_round)
    .eq('id_tournament', id)
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: 'Failed to update round' }, 500);
  }

  return c.json(data, 200);
});

tournaments.openapi(deleteRound, async (c) => {
  const { id, id_round } = c.req.valid('param');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { error } = await supabase.from('ROUNDS').delete().eq('id', id_round).eq('id_tournament', id);

  if (error) {
    return c.json({ error: 'Failed to delete round' }, 500);
  }

  return c.json({ message: 'Round deleted' }, 200);
});

tournaments.openapi(getAllMatches, async (c) => {
  const { id_round } = c.req.valid('param');

  const query = supabase
    .from('MATCHES')
    .select('*, winner:TEAMS_MATCHES(winner, id_team), teams:TEAMS(id, name)', { count: 'exact' })
    .eq('id_round', id_round)
    .order('id', { ascending: true });

  const { data, error, count } = await query;

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  const winnerTeamsId = data.reduce<winnerAccumulator>((acc, item) => {
    const winningTeams = item.winner.filter((team) => team.winner).map((team) => team.id_team);

    if (winningTeams.length > 0) {
      acc[item.id] = winningTeams;
    }

    return acc;
  }, {});

  const formattedData = data.map((item) => ({
    ...item,
    winner: winnerTeamsId[item.id] || [],
  }));

  const responseData = {
    data: formattedData || [],
    count: count || 0,
  };

  return c.json(responseData, 200);
});

tournaments.openapi(getMatchById, async (c) => {
  const { id, id_round } = c.req.valid('param');
  const { data, error } = await supabase
    .from('MATCHES')
    .select('*, winner:TEAMS_MATCHES(winner, id_team), teams:TEAMS(id, name)')
    .eq('id', id)
    .eq('id_round', id_round)
    .single();

  if (error || !data) {
    return c.json({ error: 'Match not found' }, 404);
  }

  const winnerTeamsId = data.winner.filter((team) => team.winner).map((team) => team.id_team);

  const formattedData = {
    ...data,
    winner: winnerTeamsId || [],
  };

  return c.json(formattedData, 200);
});

tournaments.openapi(createMatch, async (c) => {
  const { id_round } = c.req.valid('param');
  const { start_time, end_time, teams, winner } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  if (start_time && end_time && start_time >= end_time)
    return c.json({ error: 'Start time must be before end time' }, 400);

  const { data: dataMatches, error: errorMatches } = await supabase
    .from('MATCHES')
    .insert({ start_time, end_time, id_round })
    .select()
    .single();

  if (errorMatches || !dataMatches) {
    return c.json({ error: 'Failed to create match' }, 500);
  }

  const { data: dataTeams, error: errorTeams } = await supabase
    .from('TEAMS_MATCHES')
    .insert([
      ...(teams ?? []).map((id_team) => ({
        id_match: dataMatches.id,
        id_team,
        winner: winner?.includes(id_team) ?? false,
      })),
    ])
    .select('*, teams:TEAMS(id, name)');

  if (errorTeams || !dataTeams) {
    return c.json({ error: 'Failed to create match' }, 500);
  }

  const formattedTeams = dataTeams.map((item) => {
    if (!item.teams) {
      throw new Error('Unexpected null or undefined teams');
    }
    return {
      id: item.id_team,
      name: item.teams.name,
    };
  });

  const formattedData = {
    ...dataMatches,
    winner: [],
    teams: formattedTeams || [],
  };

  return c.json(formattedData, 201);
});

tournaments.openapi(updateMatch, async (c) => {
  const { id } = c.req.valid('param');
  const { start_time, end_time, teams, winner } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  if (start_time && end_time && start_time >= end_time)
    return c.json({ error: 'Start time must be before end time' }, 400);

  const { data, error } = await supabase
    .from('MATCHES')
    .update({ start_time, end_time })
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: 'Failed to update match' }, 500);
  }

  const { data: dataTeams, error: errorTeams } = await supabase
    .from('TEAMS_MATCHES')
    .upsert([
      ...(teams ?? []).map((id_team) => ({
        id_match: id,
        id_team,
        winner: winner?.includes(id_team) ?? false,
      })),
    ])
    .select('*, teams:TEAMS(id, name)');

  console.log(dataTeams, errorTeams);

  if (errorTeams || !dataTeams) {
    return c.json({ error: 'Failed to update match' }, 500);
  }

  const formattedTeams = dataTeams.map((item) => {
    if (!item.teams) {
      throw new Error('Unexpected null or undefined teams');
    }
    return {
      id: item.id_team,
      name: item.teams.name,
      winner: item.winner,
    };
  });

  const winnerTeamsId = dataTeams.filter((team) => team.winner).map((team) => team.id_team);

  const formattedData = {
    id: data.id,
    start_time: data.start_time,
    end_time: data.end_time,
    winner: winnerTeamsId || [],
    teams: formattedTeams || [],
  };

  return c.json(formattedData, 200);
});

tournaments.openapi(deleteMatch, async (c) => {
  const { id } = c.req.valid('param');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { error } = await supabase.from('MATCHES').delete().eq('id', id);

  if (error) {
    return c.json({ error: 'Failed to delete match' }, 500);
  }

  return c.json({ message: 'Match deleted' }, 200);
});
