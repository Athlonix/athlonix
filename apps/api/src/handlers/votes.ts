import crypto from 'node:crypto';
import { OpenAPIHono } from '@hono/zod-openapi';
import { io } from '../libs/socket.js';
import { supabase } from '../libs/supabase.js';
import { getPolls } from '../libs/votes.js';
import { zodErrorHook } from '../libs/zodError.js';
import {
  createPoll,
  deletePoll,
  getAllPolls,
  getOnePoll,
  getUserVotedPoll,
  updatePoll,
  voteToPoll,
} from '../routes/votes.js';
import { checkRole } from '../utils/context.js';
import { getPagination } from '../utils/pagnination.js';
import { Role, type Variables } from '../validators/general.js';

export const polls = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

supabase
  .channel('realtime_votes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'POLLS_VOTES' }, (payload) => {
    io.emit('receivedVote', payload.new);
  })
  .subscribe();

polls.openapi(getUserVotedPoll, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, true);

  const { data: dataPoll, error: errorPoll } = await supabase.from('POLLS').select('id');
  if (errorPoll || !dataPoll) {
    return c.json({ error: 'Failed to retrieve polls' }, 400);
  }

  const secret = process.env.SUPABASE_KEY || 'supabase';
  const hashedUser: string[] = [];

  for (const poll of dataPoll) {
    const toHash = `${user.id}-${poll.id}`;
    const hash = crypto?.createHmac('sha256', secret).update(toHash).digest('hex');
    hashedUser.push(hash);
  }

  const { data, error } = await supabase.from('USERS_VOTES').select('id_poll').in('user', hashedUser);

  if (error || !data) {
    return c.json({ error: 'Failed to retrieve votes' }, 400);
  }
  const ids = data.map((vote) => vote.id_poll);

  return c.json({ voted: ids }, 200);
});

polls.openapi(getAllPolls, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, true);
  const { all, search, skip, take, hidden } = c.req.valid('query');

  const query = supabase
    .from('POLLS')
    .select('*, results:POLLS_OPTIONS (id, content, votes:POLLS_VOTES (id_option), id_original)', { count: 'exact' })
    .is('parent_poll', null)
    .order('id', { ascending: true });

  if (search) {
    query.ilike('title', `%${search}%`);
  }

  if (!all) {
    const { from, to } = getPagination(skip, take - 1);
    query.range(from, to);
  }

  const { count, data, error } = await query;

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  const { data: subData, error: subError } = await supabase
    .from('POLLS')
    .select('*, results:POLLS_OPTIONS (id, content, votes:POLLS_VOTES (id_option), id_original)')
    .not('parent_poll', 'is', null)
    .order('id', { ascending: true });

  if (subError) {
    return c.json({ error: subError.message }, 500);
  }

  const format = data.map((poll) => ({
    ...poll,
    results: poll.results.map((option) => ({ ...option, votes: option.votes.length })),
  }));

  const subFormat = subData.map((poll) => ({
    ...poll,
    results: poll.results.map((option) => ({ ...option, votes: option.votes.length })),
  }));

  const finalData = format.map((poll) => {
    const subPolls = subFormat.filter((subPoll) => subPoll.parent_poll === poll.id);
    return {
      ...poll,
      sub_polls: subPolls,
    };
  });

  if (hidden) {
    const filteredSubPolls = finalData.map((poll) => getPolls(poll));
    return c.json({ data: filteredSubPolls || [], count: count || 0 }, 200);
  }

  const responseData = {
    data: finalData || [],
    count: count || 0,
  };

  return c.json(responseData, 200);
});

polls.openapi(getOnePoll, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, true);
  const { id } = c.req.valid('param');
  const { hidden } = c.req.valid('query');

  const { data, error } = await supabase
    .from('POLLS')
    .select('*, results:POLLS_OPTIONS (id, content, votes:POLLS_VOTES (id_option), id_original)', { count: 'exact' })
    .eq('id', id)
    .single();

  if (error || !data) {
    return c.json({ error: 'Poll not found' }, 404);
  }

  const { data: subData, error: subError } = await supabase
    .from('POLLS')
    .select('*, results:POLLS_OPTIONS (id, content, votes:POLLS_VOTES (id_option), id_original)')
    .not('parent_poll', 'is', null)
    .order('id', { ascending: true });

  if (subError) {
    return c.json({ error: subError.message }, 500);
  }

  const format = data.results.map((option) => ({ ...option, votes: option.votes.length }));
  const subFormat = subData.map((poll) => ({
    ...poll,
    results: poll.results.map((option) => ({ ...option, votes: option.votes.length })),
  }));

  const finalData = {
    ...data,
    results: format,
    sub_polls: subFormat.filter((poll) => poll.parent_poll === data.id),
  };

  if (hidden) {
    return c.json(getPolls(finalData), 200);
  }

  return c.json(finalData, 200);
});

polls.openapi(createPoll, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  const id_user = user.id;
  await checkRole(roles, false, [Role.ADMIN]);
  const {
    title,
    description,
    start_at,
    end_at,
    max_choices,
    options,
    assembly,
    parent_poll,
    round,
    keep,
    end_condition,
  } = c.req.valid('json');

  if (!options || options.length < 2) {
    return c.json({ error: 'Poll must have at least 2 options' }, 400);
  }

  const { data, error } = await supabase
    .from('POLLS')
    .insert({
      title,
      description,
      start_at,
      end_at,
      max_choices,
      id_user,
      assembly,
      parent_poll,
      round,
      keep,
      end_condition,
    })
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: 'Failed to create poll' }, 400);
  }

  let optionsData: {
    content: string | null;
    id: number;
    id_original: number | null;
    id_poll: number;
  }[];

  if (parent_poll) {
    const { data: retrievedData, error } = await supabase
      .from('POLLS_OPTIONS')
      .insert(
        options.map((option) => ({
          id_original: option.id_original,
          id_poll: data.id,
        })),
      )
      .select();

    if (error || !retrievedData) {
      return c.json({ error: 'Failed to create options' }, 400);
    }
    optionsData = retrievedData;
  } else {
    const { data: retrievedData, error } = await supabase
      .from('POLLS_OPTIONS')
      .insert(
        options.map((option) => ({
          content: option.content,
          id_poll: data.id,
        })),
      )
      .select();

    if (error || !retrievedData) {
      return c.json({ error: 'Failed to create options' }, 400);
    }
    optionsData = retrievedData;
  }

  const returnedJson = {
    ...data,
    results: optionsData.map(({ id_poll, ...rest }) => ({ ...rest, votes: 0 })),
  };

  return c.json(returnedJson, 201);
});

polls.openapi(updatePoll, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false, [Role.ADMIN]);
  const { id } = c.req.valid('param');
  const { title, description, start_at, end_at, max_choices, assembly } = c.req.valid('json');

  const { data, error } = await supabase
    .from('POLLS')
    .update({ title, description, start_at, end_at, max_choices, assembly })
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: 'Failed to update poll' }, 400);
  }

  return c.json(data, 200);
});

polls.openapi(deletePoll, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false, [Role.ADMIN]);

  const { id } = c.req.valid('param');

  const { error, count } = await supabase.from('POLLS').delete({ count: 'exact' }).eq('id', id);

  if (error || count === 0) {
    return c.json({ error: 'Poll not found' }, 404);
  }

  return c.json({ message: 'Poll deleted' }, 200);
});

// TODO: Implement functions to simplify the verif
polls.openapi(voteToPoll, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, true);
  const { id } = c.req.valid('param');
  const { options } = c.req.valid('json');

  const duplicates = options.filter((value: number, index: number) => options.indexOf(value) !== index);
  if (duplicates.length > 0) {
    return c.json({ error: 'Duplicated votes' }, 400);
  }

  const secret = process.env.SUPABASE_KEY || 'supabase';
  const toHash = `${user.id}-${id}`;
  const hash = crypto?.createHmac('sha256', secret).update(toHash).digest('hex');

  const { data: votes, error: votesError } = await supabase
    .from('POLLS')
    .select('*, USERS_VOTES(*)')
    .eq('id', id)
    .eq('USERS_VOTES.user', hash)
    .single();

  if (votesError) {
    return c.json({ error: 'Failed to retrieve votes' }, 400);
  }

  if (votes && votes.USERS_VOTES.length > 0) {
    return c.json({ error: 'User already voted' }, 400);
  }

  if (votes && new Date(votes?.start_at) > new Date()) {
    return c.json({ error: 'Poll not started' }, 400);
  }

  if (votes && new Date(votes?.end_at) < new Date()) {
    return c.json({ error: 'Poll already ended' }, 400);
  }

  if (votes.assembly) {
    const { data: assembly, error: assemblyError } = await supabase
      .from('ASSEMBLIES')
      .select('id, ASSEMBLIES_ATTENDEES(id_member)')
      .eq('id', votes.assembly)
      .single();

    if (assemblyError || !assembly) {
      return c.json({ error: 'Assembly not found' }, 404);
    }

    const member = assembly.ASSEMBLIES_ATTENDEES.find(
      (attendee: { id_member: number | null }) => attendee.id_member !== null && attendee.id_member === user.id,
    );

    if (!member) {
      return c.json({ error: 'User is not part of the assembly' }, 400);
    }
  }

  const { data, error } = await supabase
    .from('POLLS_VOTES')
    .insert(options.map((id_option: number) => ({ id_poll: id, id_option })))
    .select();

  if (error || !data) {
    return c.json({ error: 'Failed to vote' }, 400);
  }

  const { data: pollData, error: pollError } = await supabase
    .from('USERS_VOTES')
    .insert({ id_poll: id, user: hash })
    .select();

  if (pollError || !pollData) {
    return c.json({ error: 'Failed to vote' }, 400);
  }

  return c.json({ message: 'Vote registered' }, 201);
});
