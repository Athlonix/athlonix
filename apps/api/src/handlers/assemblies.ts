import { OpenAPIHono } from '@hono/zod-openapi';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import {
  confirmMemberPresence,
  createAssembly,
  deleteAssembly,
  getAllAssemblies,
  getOneAssembly,
  updateAssembly,
} from '../routes/assemblies.js';
import { checkRole } from '../utils/context.js';
import { getPagination } from '../utils/pagnination.js';
import type { Variables } from '../validators/general.js';

export const assemblies = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
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
  };

  return c.json(format, 200);
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
  }));

  return c.json({ data: format, count: count || 0 }, 200);
});

assemblies.openapi(createAssembly, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { name, description, date, location, lawsuit } = c.req.valid('json');

  const { data, error } = await supabase
    .from('ASSEMBLIES')
    .insert({ name, description, date, location, lawsuit })
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
  };

  return c.json(format, 201);
});

assemblies.openapi(updateAssembly, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { id } = c.req.valid('param');
  const { name, description, date, location, lawsuit } = c.req.valid('json');

  if (date && new Date(date) < new Date()) {
    return c.json({ error: 'Date must be in the future' }, 400);
  }

  const { data: assembly, error: assemblyError } = await supabase.from('ASSEMBLIES').select('id').eq('id', id).single();

  if (assemblyError || !assembly) {
    return c.json({ error: 'Assembly not found' }, 404);
  }

  const { data, error } = await supabase
    .from('ASSEMBLIES')
    .update({ name, description, date, location, lawsuit })
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
  };

  return c.json(format, 200);
});

assemblies.openapi(deleteAssembly, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { id } = c.req.valid('param');

  const { data: assembly, error: assemblyError } = await supabase.from('ASSEMBLIES').select('id').eq('id', id).single();

  if (assemblyError || !assembly) {
    return c.json({ error: 'Assembly not found' }, 404);
  }

  const { error } = await supabase.from('ASSEMBLIES').delete().eq('id', id);

  if (error) {
    return c.json({ error: 'Failed to delete assembly' }, 500);
  }

  return c.json({ message: 'Assembly deleted' }, 200);
});

assemblies.openapi(confirmMemberPresence, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { id, id_member } = c.req.valid('param');

  const { data: assembly, error: assemblyError } = await supabase.from('ASSEMBLIES').select('id').eq('id', id).single();

  if (assemblyError || !assembly) {
    return c.json({ error: 'Assembly not found' }, 404);
  }

  const { data: member, error: memberError } = await supabase
    .from('USERS')
    .select('id, date_validity')
    .eq('id', id_member)
    .single();

  if (memberError || !member) {
    return c.json({ error: 'Member not found' }, 404);
  }

  if (member.date_validity && new Date(member.date_validity) < new Date()) {
    return c.json({ error: 'Member subscription expired' }, 400);
  }

  const { error } = await supabase.from('ASSEMBLIES_ATTENDEES').insert({ id_assembly: id, id_user: id_member });

  if (error) {
    return c.json({ error: 'Failed to confirm member' }, 500);
  }

  return c.json({ message: 'Member confirmed' }, 200);
});
