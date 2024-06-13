import crypto from 'node:crypto';
import { OpenAPIHono } from '@hono/zod-openapi';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import {
  closeAssembly,
  confirmMemberPresence,
  createAssembly,
  generateAssemblyQrCode,
  getAllAssemblies,
  getOneAssembly,
  handleAssemblyCheckIn,
  isAlreadyConfirmed,
  updateAssembly,
} from '../routes/assemblies.js';
import { addUserToAssembly, checkAssemblyAndUser, getAssemblyWithCode } from '../utils/assemblies.js';
import { checkRole } from '../utils/context.js';
import { getPagination } from '../utils/pagnination.js';
import type { Variables } from '../validators/general.js';

export const assemblies = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

assemblies.openapi(getAllAssemblies, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, true);
  const { all, search, skip, take, date, location } = c.req.valid('query');

  const query = supabase
    .from('ASSEMBLIES')
    .select('*, attendees:ASSEMBLIES_ATTENDEES(users:USERS(id,first_name,last_name, email))', { count: 'exact' })
    .order('id', { ascending: true });

  if (search) {
    query.ilike('name', `%${search}%`);
  }

  if (date) {
    query.eq('date', date);
  }

  if (location) {
    query.eq('location.id', location);
  }

  if (!all) {
    const { from, to } = getPagination(skip, take - 1);
    query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error || !data) {
    return c.json({ error: error.message }, 500);
  }

  const format = data.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description || null,
    date: row.date,
    location: row.location || null,
    attendees: row.attendees ? row.attendees.flatMap((attendee) => attendee.users || []) : [],
    lawsuit: row.lawsuit || null,
    closed: row.closed,
  }));

  return c.json({ data: format, count: count || 0 }, 200);
});

assemblies.openapi(createAssembly, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { name, description, date, location } = c.req.valid('json');

  const { data, error } = await supabase
    .from('ASSEMBLIES')
    .insert({ name, description, date, location, lawsuit: null })
    .select('*,location:ADDRESSES(*)')
    .single();

  if (error || !data) {
    return c.json({ error: 'Failed to create assembly' }, 400);
  }

  const format = {
    id: data.id,
    name: data.name,
    description: data.description || null,
    date: data.date,
    location: data.location || null,
    lawsuit: data.lawsuit || null,
    closed: data.closed,
  };

  return c.json(format, 201);
});

assemblies.openapi(handleAssemblyCheckIn, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, true);

  const { code } = c.req.valid('json');

  const assembly = await getAssemblyWithCode(code);
  if ('error' in assembly) {
    return c.json({ error: assembly.error }, assembly.status);
  }

  const add = await addUserToAssembly(assembly.id, user.id);
  if (add !== true && add.error && add.status) {
    return c.json({ error: add.error }, add.status);
  }

  return c.json({ message: 'Member confirmed' }, 200);
});

assemblies.openapi(isAlreadyConfirmed, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, true);

  const { code } = c.req.valid('json');

  const assembly = await getAssemblyWithCode(code);
  if ('error' in assembly) {
    return c.json({ error: assembly.error }, assembly.status);
  }

  const { data: attendee, error: attendeeError } = await supabase
    .from('ASSEMBLIES_ATTENDEES')
    .select('id')
    .eq('id_assembly', assembly.id)
    .eq('id_member', user.id)
    .single();

  if (attendeeError || attendee) {
    return c.json({ confirmed: true }, 200);
  }

  return c.json({ confirmed: false }, 200);
});

assemblies.openapi(getOneAssembly, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, true);
  const { id } = c.req.valid('param');

  const { data, error } = await supabase
    .from('ASSEMBLIES')
    .select('*,attendees:ASSEMBLIES_ATTENDEES(users:USERS(id,first_name,last_name, email))')
    .eq('id', id)
    .single();

  if (error || !data) {
    return c.json({ error: 'Assembly not found' }, 404);
  }

  const format = {
    id: data.id,
    name: data.name,
    description: data.description || null,
    date: data.date,
    location: data.location || null,
    attendees: data.attendees ? data.attendees.flatMap((attendee) => attendee.users || []) : [],
    lawsuit: data.lawsuit || null,
    closed: data.closed,
  };

  return c.json(format, 200);
});

assemblies.openapi(updateAssembly, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { id } = c.req.valid('param');
  const { name, description, date, location, lawsuit, closed } = c.req.valid('json');

  if (date && new Date(date) < new Date()) {
    return c.json({ error: 'Date must be in the future' }, 400);
  }

  const { data: assembly, error: assemblyError } = await supabase.from('ASSEMBLIES').select('id').eq('id', id).single();

  if (assemblyError || !assembly) {
    return c.json({ error: 'Assembly not found' }, 404);
  }

  const { data, error } = await supabase
    .from('ASSEMBLIES')
    .update({ name, description, date, location, lawsuit, closed: closed || false })
    .eq('id', id)
    .select('*,location:ADDRESSES(*)')
    .single();

  if (error || !data) {
    return c.json({ error: 'Failed to update assembly' }, 400);
  }

  const format = {
    id: data.id,
    name: data.name,
    description: data.description || null,
    date: data.date,
    location: data.location || null,
    lawsuit: data.lawsuit || null,
    closed: data.closed,
  };

  return c.json(format, 200);
});

assemblies.openapi(closeAssembly, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { id } = c.req.valid('param');
  const { lawsuit } = c.req.valid('json');

  const { data: assembly, error: assemblyError } = await supabase.from('ASSEMBLIES').select('id').eq('id', id).single();

  if (assemblyError || !assembly) {
    return c.json({ error: 'Assembly not found' }, 404);
  }

  const { error } = await supabase.from('ASSEMBLIES').update({ closed: true, lawsuit }).eq('id', id);

  if (error) {
    return c.json({ error: 'Failed to close assembly' }, 500);
  }

  return c.json({ message: 'Assembly closed' }, 200);
});

assemblies.openapi(confirmMemberPresence, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { id, id_member } = c.req.valid('param');

  const check = await checkAssemblyAndUser(id, id_member);
  if (check !== true && check.error && check.status) {
    return c.json({ error: check.error }, check.status);
  }

  const add = await addUserToAssembly(id, id_member);
  if (add !== true && add.error && add.status) {
    return c.json({ error: add.error }, add.status);
  }

  return c.json({ message: 'Member confirmed' }, 200);
});

function getRndInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

assemblies.openapi(generateAssemblyQrCode, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { id } = c.req.valid('param');

  const { data: assembly, error: assemblyError } = await supabase.from('ASSEMBLIES').select('id').eq('id', id).single();

  if (assemblyError || !assembly) {
    return c.json({ error: 'Assembly not found' }, 404);
  }

  const hash = crypto
    .createHash('sha256')
    .update(`${id}-${getRndInteger(1000, 9999)}`)
    .digest('hex');

  const { error } = await supabase.from('ASSEMBLIES').update({ code: hash }).eq('id', id);

  if (error) {
    return c.json({ error: 'Failed to generate QR code' }, 500);
  }

  const urlRedirection = `https://athlonix-client.jayllyz.fr/members/assemblies/check?code=${hash}`;
  const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${urlRedirection}`;

  return c.json({ qrCode }, 200);
});
