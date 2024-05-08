import { OpenAPIHono } from '@hono/zod-openapi';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import {
  applyToActivity,
  cancelApplication,
  createActivity,
  deleteActivity,
  getAllActivities,
  getOneActivity,
  updateActivity,
  validApplication,
} from '../routes/activities.js';
import { checkRole } from '../utils/context.js';
import { getPagination } from '../utils/pagnination.js';
import { Role, type Variables } from '../validators/general.js';

export const activities = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

activities.openapi(getAllActivities, async (c) => {
  const { all, search, skip, take } = c.req.valid('query');

  const query = supabase.from('ACTIVITIES').select('*', { count: 'exact' }).order('id', { ascending: true });

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

  const responseData = {
    data: data || [],
    count: count || 0,
  };

  return c.json(responseData, 200);
});

activities.openapi(getOneActivity, async (c) => {
  const { id } = c.req.valid('param');
  const { data, error } = await supabase.from('ACTIVITIES').select('*').eq('id', id).single();

  if (error || !data) {
    return c.json({ error: 'Activity not found' }, 404);
  }

  return c.json(data, 200);
});

activities.openapi(createActivity, async (c) => {
  const {
    name,
    description,
    max_participants,
    min_participants,
    id_sport,
    id_address,
    recurrence,
    interval,
    days,
    start_date,
    end_date,
  } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { data, error } = await supabase
    .from('ACTIVITIES')
    .insert({
      name,
      description,
      max_participants,
      min_participants,
      id_sport,
      id_address,
      recurrence,
      interval,
      days,
      start_date,
      end_date,
    })
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: 'Failed to create activity' }, 400);
  }

  return c.json(data, 201);
});

activities.openapi(updateActivity, async (c) => {
  const { id } = c.req.valid('param');
  const {
    name,
    description,
    max_participants,
    min_participants,
    id_sport,
    id_address,
    recurrence,
    interval,
    days,
    start_date,
    end_date,
  } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { data, error } = await supabase
    .from('ACTIVITIES')
    .update({
      name,
      description,
      max_participants,
      min_participants,
      id_sport,
      id_address,
      recurrence,
      interval,
      days,
      start_date,
      end_date,
    })
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: 'Failed to update activity' }, 400);
  }

  return c.json(data, 200);
});

activities.openapi(deleteActivity, async (c) => {
  const { id } = c.req.valid('param');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { error } = await supabase.from('ACTIVITIES').delete().eq('id', id);

  if (error) {
    return c.json({ error: 'Activity not found' }, 404);
  }

  return c.json({ message: 'Activity deleted' }, 200);
});

activities.openapi(applyToActivity, async (c) => {
  const user = c.get('user');
  await checkRole(user.roles, true);

  const { id } = c.req.valid('param');
  const { data: activity, error: errorActivity } = await supabase.from('ACTIVITIES').select('*').eq('id', id).single();

  if (errorActivity || !activity) return c.json({ error: 'Activity not found' }, 404);
  if (new Date(activity.end_date) < new Date()) return c.json({ error: 'Activity has already ended' }, 400);

  const { count } = await supabase
    .from('ACTIVITIES_USERS')
    .select('count(*)', { count: 'exact' })
    .eq('id_activity', id)
    .eq('id_user', user.id)
    .single();

  if (count && count > 0) return c.json({ error: 'User already applied to activity' }, 400);

  const { count: participants } = await supabase
    .from('ACTIVITIES_USERS')
    .select('count(*)', { count: 'exact' })
    .eq('id_activity', id)
    .eq('active', true);

  if (participants && participants >= activity.max_participants) return c.json({ error: 'Activity is full' }, 400);

  const { error: errorApply } = await supabase.from('ACTIVITIES_USERS').insert({ id_activity: id, id_user: user.id });

  if (errorApply) return c.json({ error: 'Failed to apply to activity' }, 400);

  return c.json({ message: `Applied to activity ${activity.name}` }, 201);
});

activities.openapi(cancelApplication, async (c) => {
  const user = c.get('user');
  await checkRole(user.roles, true);

  const { id } = c.req.valid('param');
  const { data: activity, error: errorActivity } = await supabase.from('ACTIVITIES').select('*').eq('id', id).single();

  if (errorActivity || !activity) return c.json({ error: 'Activity not found' }, 404);

  const { error: errorCancel } = await supabase
    .from('ACTIVITIES_USERS')
    .delete()
    .eq('id_activity', id)
    .eq('id_user', user.id);

  if (errorCancel) return c.json({ error: 'Failed to cancel application' }, 400);

  return c.json({ message: `Application to activity ${activity.name} canceled` }, 200);
});

activities.openapi(validApplication, async (c) => {
  const user = c.get('user');
  await checkRole(user.roles, false, [Role.ADMIN, Role.MODERATOR]);

  const { id } = c.req.valid('param');
  const { id_user } = c.req.valid('json');
  const { data: activity, error: errorActivity } = await supabase
    .from('ACTIVITIES')
    .select('id, name, end_date')
    .eq('id', id)
    .single();

  if (errorActivity || !activity) return c.json({ error: 'Activity not found' }, 404);
  if (new Date(activity.end_date) < new Date()) return c.json({ error: 'Activity has already ended' }, 400);

  const { count } = await supabase
    .from('ACTIVITIES_USERS')
    .select('count(id)', { count: 'exact' })
    .eq('id_activity', id)
    .eq('id_user', id_user)
    .single();

  if (count && count === 0) return c.json({ error: 'User did not apply to activity' }, 400);

  const { error: errorValid } = await supabase
    .from('ACTIVITIES_USERS')
    .update({ active: true })
    .eq('id_activity', id)
    .eq('id_user', id_user);

  if (errorValid) return c.json({ error: 'Failed to validate application' }, 400);

  return c.json({ message: `Application to activity ${activity.name} validated` }, 200);
});
