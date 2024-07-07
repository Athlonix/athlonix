import { OpenAPIHono } from '@hono/zod-openapi';
import { io } from '../libs/socket.js';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import { createMessage, deleteMessage, getAllMessages, updateMessage } from '../routes/messages.js';
import { checkRole } from '../utils/context.js';
import { getPagination } from '../utils/pagnination.js';
import type { Variables } from '../validators/general.js';

export const messages = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

supabase
  .channel('realtime_messages')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'MESSAGES' }, (payload) => {
    io.emit('receivedMessage', payload.new);
  })
  .subscribe();

messages.openapi(getAllMessages, async (c) => {
  const { all, search, skip, take } = c.req.valid('query');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, true);

  const query = supabase
    .from('MESSAGES')
    .select(
      `
      *,
      sender:USERS(username)
    `,
      { count: 'exact' },
    )
    .order('created_at', { ascending: true });

  if (search) {
    query.ilike('message', `%${search}%`);
  }

  if (!all) {
    const { from, to } = getPagination(skip, take - 1);
    query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  const { data: users, error: errorUsers } = await supabase.from('USERS').select('id, username');

  if (errorUsers) {
    return c.json({ error: errorUsers.message }, 500);
  }

  const finalData = data.map((message) => ({
    ...message,
    name: message.sender?.username || 'Unknown',
    sender: undefined,
  }));

  return c.json({ data: finalData, count: count || 0 }, 200);
});

messages.openapi(createMessage, async (c) => {
  const { message } = c.req.valid('json');
  const user = c.get('user');
  const { id } = user;
  const { data, error } = await supabase.from('MESSAGES').insert({ id_sender: id, message }).select().single();

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json(data, 201);
});

messages.openapi(updateMessage, async (c) => {
  const { id } = c.req.valid('param');
  const { message } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, true);

  const { data, error } = await supabase
    .from('MESSAGES')
    .update({ message, updated_at: new Date().toLocaleDateString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return c.json({ error: 'Message not found' }, 404);
  }

  return c.json(data, 200);
});

messages.openapi(deleteMessage, async (c) => {
  const { id } = c.req.valid('param');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, true);

  const { error, count } = await supabase.from('MESSAGES').delete({ count: 'exact' }).eq('id', id);

  if (error || count === 0) {
    return c.json({ error: 'Message not found' }, 404);
  }

  return c.json({ message: 'Message deleted' }, 200);
});
