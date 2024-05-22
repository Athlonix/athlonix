import { OpenAPIHono } from '@hono/zod-openapi';
import { HTTPException } from 'hono/http-exception';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import { addActivityMember, removeActivityMember } from '../routes/teams.js';
import type { Variables } from '../validators/general.js';
import { Role } from '../validators/general.js';

export const activities_teams = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

activities_teams.openapi(addActivityMember, async (c) => {
  const { id_activity, id_user } = c.req.valid('param');

  const user = c.get('user');
  const roles = user.roles;
  if (!roles) throw new HTTPException(403, { message: 'No user role found' });

  if (!roles.includes(Role.ADMIN)) {
    throw new HTTPException(403, { message: 'Forbidden' });
  }

  const { data: userFound } = await supabase.from('USERS').select('*, roles:ROLES (id)').eq('id', id_user).single();

  if (!userFound) {
    return c.json({ error: 'User not found' }, 404);
  }

  if (!userFound.roles.find((obj) => obj.id === Role.EMPLOYEE)) {
    return c.json({ error: 'User is not an employee and cannot be added to the team' }, 400);
  }

  const { data: userInTeam } = await supabase
    .from('USERS')
    .select('*, ACTIVITY_TEAMS')
    .eq('ACTIVITY_TEAMS.id_activity', id_activity)
    .eq('ACTIVITY_TEAMS.id_user', id_user)
    .single();

  if (userInTeam) {
    return c.json({ error: `user ${id_user} is already in the team` }, 400);
  }

  const { data, error } = await supabase
    .from('ACTIVITY_TEAMS')
    .insert({ id_activity: id_activity, id_user: id_user })
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: 'Failed to add user to the team' }, 500);
  }

  return c.json(data, 200);
});

activities_teams.openapi(removeActivityMember, async (c) => {
  const { id_activity, id_user } = c.req.valid('param');

  const user = c.get('user');
  const roles = user.roles;
  if (!roles) throw new HTTPException(403, { message: 'No user role found' });

  if (!roles.includes(Role.ADMIN)) {
    throw new HTTPException(403, { message: 'Forbidden' });
  }

  const { data: userFound } = await supabase.from('USERS').select('*, roles:ROLES (id)').eq('id', id_user).single();

  if (!userFound) {
    return c.json({ error: 'User not found' }, 404);
  }

  const { data, error } = await supabase
    .from('ACTIVITY_TEAMS')
    .insert({ id_activity: id_activity, id_user: id_user })
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: 'Failed to add user to the team' }, 500);
  }

  const { error: deletionError } = await supabase
    .from('ACTIVITY_TEAMS')
    .delete()
    .eq('ACTIVITY_TEAMS.id_activity', id_activity)
    .eq('ACTIVITY_TEAMS.id_user', id_user);

  if (deletionError) {
    return c.json({ error: 'Team member not found' }, 404);
  }

  return c.json({ message: `Team memver with id ${id_user} deleted from team ${id_activity}` }, 200);
});
