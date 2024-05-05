import { randomInt } from 'node:crypto';
import crypto from 'node:crypto';
import { OpenAPIHono } from '@hono/zod-openapi';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import {
  createPoll,
  deletePoll,
  getAllPolls,
  getOnePoll,
  getPollResults,
  updatePoll,
  voteToPoll,
} from '../routes/votes.js';
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
  const { skip, take } = c.req.valid('query');
  const { from, to } = getPagination(skip, take - 1);

  const { data, error } = await supabase.from('POLLS').select('*, results:POLLS_VOTES(*)').range(from, to);

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json(data, 200);
});

polls.openapi(getOnePoll, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, true);
  const { id } = c.req.valid('param');
  const { data, error } = await supabase.from('POLLS').select('*, results:POLLS_VOTES(*)').eq('id', id).single();

  if (error || !data) {
    return c.json({ error: 'Poll not found' }, 404);
  }

  return c.json(data, 200);
});

polls.openapi(createPoll, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  const id_user = user.id;
  await checkRole(roles, false, [Role.ADMIN]);
  const { title, description, start_at, end_at, max_choices, options } = c.req.valid('json');

  if (!options || options.length < 2) {
    return c.json({ error: 'Poll must have at least 2 options' }, 400);
  }

  const { data, error } = await supabase
    .from('POLLS')
    .insert({ title, description, start_at, end_at, max_choices, id_user })
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
  const { title, description, start_at, end_at, max_choices, options } = c.req.valid('json');

  if (!options || options.length < 2) {
    return c.json({ error: 'Poll must have at least 2 options' }, 400);
  }

  const { data, error } = await supabase
    .from('POLLS')
    .update({ title, description, start_at, end_at, max_choices })
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: 'Failed to update poll' }, 400);
  }

  if (options) {
    const { data: optionsData, error: optionsError } = await supabase
      .from('POLLS_OPTIONS')
      .insert(
        options.map((option: { content: string }) => ({
          content: option.content,
          id_poll: id,
        })),
      )
      .select();

    if (optionsError || !optionsData) {
      return c.json({ error: 'Failed to create options' }, 400);
    }
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
    return c.json({ error: 'Failed to delete poll' }, 400);
  }

  return c.json({ message: 'Poll deleted' }, 200);
});

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

  const { data, error } = await supabase
    .from('POLLS_VOTES')
    .insert(options.map((id_option: number) => ({ id_poll: id, id_option })))
    .select();

  if (error || !data) {
    return c.json({ error: 'Failed to vote' }, 400);
  }

  const randomDelay = randomInt(10, 5000);
  setTimeout(async () => {}, randomDelay);

  const { data: pollData, error: pollError } = await supabase
    .from('USERS_VOTES')
    .insert({ id_poll: id, user: hash })
    .select();

  if (pollError || !pollData) {
    return c.json({ error: 'Failed to vote' }, 400);
  }

  return c.json({ message: 'Vote registered' }, 201);
});

type Results = {
  id: number;
  title: string;
  results: { id: number; content: string; votes: number }[];
};

polls.openapi(getPollResults, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, true);
  const { id } = c.req.valid('param');
  const { data, error } = await supabase
    .from('POLLS')
    .select('*, results:POLLS_VOTES(*), options:POLLS_OPTIONS(*)')
    .eq('id', id)
    .single();

  if (error || !data) {
    return c.json({ error: 'Poll not found' }, 404);
  }

  const results: Results = {
    id: data.id,
    title: data.title,
    results: data.options.map((option: { id: number; content: string }) => ({
      id: option.id,
      content: option.content,
      votes: data.results.filter((vote: { id_option: number }) => vote.id_option === option.id).length,
    })),
  };

  return c.json(results, 200);
});
