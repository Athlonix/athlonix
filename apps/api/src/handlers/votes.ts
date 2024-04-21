import { randomInt } from 'node:crypto';
import crypto from 'node:crypto';
import { OpenAPIHono } from '@hono/zod-openapi';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import { createPoll, deletePoll, getAllPolls, getOnePoll, updatePoll, voteToPoll } from '../routes/votes.js';
import type { POLLS_ARRAY } from '../routes/votes.js';
import { checkRole } from '../utils/context.js';
import { getPagination } from '../utils/pagnination.js';
import { Role, type Variables } from '../validators/general.js';

export const polls = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

polls.openapi(getAllPolls, async (c) => {
  const { skip, take } = c.req.valid('query');
  const { from, to } = getPagination(skip, take - 1);

  const { data, error } = await supabase
    .from('POLLS')
    .select('*, results:POLLS_VOTES(*)')
    .returns<POLLS_ARRAY>()
    .range(from, to);

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json(data, 200);
});

polls.openapi(getOnePoll, async (c) => {
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
  const { data, error } = await supabase.from('POLLS').delete().eq('id', id).single();

  if (error || !data) {
    return c.json({ error: 'Failed to delete poll' }, 400);
  }

  return c.json(data, 200);
});

polls.openapi(voteToPoll, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, true);
  const { id } = c.req.valid('param');
  const { id_option } = c.req.valid('json');

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

  if (votes && votes.USERS_VOTES.length >= votes.max_choices) {
    return c.json({ error: 'No votes available' }, 400);
  }

  const { data, error } = await supabase.from('POLLS_VOTES').insert({ id_poll: id, id_option }).select().single();

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
