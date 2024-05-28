import crypto from 'node:crypto';
import { OpenAPIHono } from '@hono/zod-openapi';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import { createPoll, deletePoll, getAllPolls, getOnePoll, updatePoll, voteToPoll } from '../routes/votes.js';
import { checkRole } from '../utils/context.js';
import { getPagination } from '../utils/pagnination.js';
import { Role, type Variables } from '../validators/general.js';

export const polls = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

polls.openapi(getAllPolls, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, true);
  const { all, search, skip, take } = c.req.valid('query');

  const query = supabase
    .from('POLLS')
    .select('*, results:POLLS_OPTIONS (id, content, votes:POLLS_VOTES (id_option))', { count: 'exact' })
    .order('id', { ascending: true });

  if (search) {
    query.ilike('title', `%${search}%`);
  }

  if (!all) {
    const { from, to } = getPagination(skip, take - 1);
    query.range(from, to);
  }

  const { data, error } = await query;

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  const format = data.map((poll) => ({
    ...poll,
    results: poll.results.map((option) => ({ ...option, votes: option.votes.length })),
  }));

  return c.json(format, 200);
});

polls.openapi(getOnePoll, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, true);
  const { id } = c.req.valid('param');

  const { data, error } = await supabase
    .from('POLLS')
    .select('*, results:POLLS_OPTIONS (id, content, votes:POLLS_VOTES (id_option))', { count: 'exact' })
    .eq('id', id)
    .single();

  if (error || !data) {
    return c.json({ error: 'Poll not found' }, 404);
  }

  const format = data.results.map((option) => ({ ...option, votes: option.votes.length }));

  return c.json({ ...data, results: format }, 200);
});

polls.openapi(createPoll, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  const id_user = user.id;
  await checkRole(roles, false, [Role.ADMIN]);
  const { title, description, start_at, end_at, max_choices, options, assembly } = c.req.valid('json');

  if (!options || options.length < 2) {
    return c.json({ error: 'Poll must have at least 2 options' }, 400);
  }

  const { data, error } = await supabase
    .from('POLLS')
    .insert({ title, description, start_at, end_at, max_choices, id_user, assembly })
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: 'Failed to create poll' }, 400);
  }

  const { data: optionsData, error: optionsError } = await supabase
    .from('POLLS_OPTIONS')
    .insert(
      options.map((option: { content: string }) => ({
        content: option.content,
        id_poll: data.id,
      })),
    )
    .select();

  if (optionsError || !optionsData) {
    return c.json({ error: 'Failed to create options' }, 400);
  }

  return c.json(data, 201);
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
  const { error } = await supabase.from('POLLS').delete().eq('id', id);

  if (error) {
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
