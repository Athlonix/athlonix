import { OpenAPIHono } from '@hono/zod-openapi';
import { getOccurences } from '../libs/activities.js';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import {
  applyToActivity,
  cancelApplication,
  createActivity,
  createActivityException,
  deleteActivity,
  getAllActivities,
  getAllActivitiesExceptions,
  getOneActivity,
  getOneActivityOccurences,
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

  const query = supabase
    .from('ACTIVITIES')
    .select('*, sport:SPORTS (id,name)', { count: 'exact' })
    .order('id', { ascending: true });

  if (search) {
    query.ilike('name', `%${search}%`);
  }

  if (!all) {
    const { from, to } = getPagination(skip, take - 1);
    query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    return c.json({ error: 'Failed to fetch activities' }, 500);
  }

  const responseData = {
    data: data || [],
    count: count || 0,
  };

  return c.json(responseData, 200);
});

activities.openapi(getOneActivity, async (c) => {
  const { id } = c.req.valid('param');

  const { data, error } = await supabase.from('ACTIVITIES').select('*, sport:SPORTS (id,name)').eq('id', id).single();

  if (error || !data) {
    return c.json({ error: 'Activity not found' }, 404);
  }

  return c.json(data, 200);
});

activities.openapi(getOneActivityOccurences, async (c) => {
  const { id: id_activity } = c.req.valid('param');
  let { start_date, end_date } = c.req.valid('query');

  if (!start_date && !end_date) {
    return c.json({ error: 'start_date and end_date params are mandatory' }, 400);
  }

  const { data: activityFound, error } = await supabase
    .from('ACTIVITIES')
    .select('*, sport:SPORTS (id,name)')
    .eq('id', id_activity)
    .single();
  if (error) {
    return c.json({ error: 'Error while fetching activity' }, 500);
  }

  if (!activityFound) {
    return c.json({ error: 'Activity not found' }, 404);
  }

  if (!activityFound.frequency || !activityFound.days_of_week) {
    return c.json(
      {
        activity: activityFound,
        occurences: [],
      },
      200,
    );
  }

  if (activityFound.start_date) {
    if (new Date(activityFound.start_date) > new Date(start_date)) {
      start_date = activityFound.start_date;
    }
  }

  if (activityFound.end_date) {
    if (new Date(activityFound.end_date) > new Date(end_date)) {
      end_date = activityFound.end_date;
    }
  }

  const query = supabase
    .from('ACTIVITIES_EXCEPTIONS')
    .select('*', { count: 'exact' })
    .eq('id_activity', id_activity)
    .order('id', { ascending: true });

  if (start_date && end_date) {
    query.gte('date', start_date).lte('date', end_date);
  } else if (start_date) {
    query.gte('date', start_date);
  } else if (end_date) {
    query.lte('date', end_date);
  }

  const { data: activitesExceptions, error: activitiesError } = await query;

  if (activitiesError || !activitesExceptions) {
    return c.json({ error: 'Error while fetching activity' }, 500);
  }

  const occurences = getOccurences(
    new Date(start_date),
    new Date(end_date),
    activityFound.days_of_week,
    activitesExceptions,
  );

  return c.json(
    {
      activity: activityFound,
      occurences: occurences,
    },
    200,
  );
});

activities.openapi(createActivity, async (c) => {
  const {
    name,
    description,
    max_participants,
    min_participants,
    days_of_week,
    frequency,
    start_date,
    end_date,
    start_time,
    end_time,
    id_sport,
    id_address,
  } = c.req.valid('json');

  const user = c.get('user');
  const roles = user.roles;

  await checkRole(roles, false);

  const uniqueEventInvalid: boolean = !frequency && (!start_date || !end_date || !start_time || !end_time);

  if (uniqueEventInvalid) {
    return c.json({ error: 'You must provide date and time to create a unique event' }, 400);
  }

  if (frequency && frequency === 'daily' && (!days_of_week || !start_time || !end_time)) {
    return c.json({ error: 'You must provide days of week for weekly frequency' }, 400);
  }

  const { data, error } = await supabase
    .from('ACTIVITIES')
    .insert({
      name,
      description,
      max_participants,
      min_participants,
      days_of_week,
      frequency,
      start_date,
      end_date,
      start_time,
      end_time,
      id_sport,
      id_address,
    })
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: 'Failed to create activity' }, 500);
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
    days_of_week,
    frequency,
    start_date,
    end_date,
    start_time,
    end_time,
    id_sport,
    id_address,
  } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { data, error } = await supabase
    .from('ACTIVITIES')
    .update({
      description,
      max_participants,
      min_participants,
      days_of_week,
      frequency,
      start_date,
      end_date,
      start_time,
      end_time,
      id_sport,
      id_address,
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
  if (activity.end_date && new Date(activity.end_date) < new Date())
    return c.json({ error: 'Activity has already ended' }, 400);

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
  if (activity.end_date && new Date(activity.end_date) < new Date())
    return c.json({ error: 'Activity has already ended' }, 400);

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

activities.openapi(createActivityException, async (c) => {
  const { date, max_participants, min_participants } = c.req.valid('json');

  const { id: id_activity } = c.req.valid('param');

  const user = c.get('user');
  const roles = user.roles;

  await checkRole(roles, false);

  const { data: activityFound, error } = await supabase.from('ACTIVITIES').select('id').eq('id', id_activity).single();

  if (error || !activityFound) {
    return c.json({ error: 'Activity not found' }, 404);
  }

  const { data: activityException, error: insertError } = await supabase
    .from('ACTIVITIES_EXCEPTIONS')
    .insert({
      id_activity,
      date,
      min_participants,
      max_participants,
    })
    .select()
    .single();

  if (insertError || !activityException) {
    return c.json({ error: 'Failed to create activity' }, 500);
  }

  return c.json(activityException, 201);
});

activities.openapi(getAllActivitiesExceptions, async (c) => {
  const { all, start_date, end_date } = c.req.valid('query');
  const { id: id_activity } = c.req.valid('param');

  const query = supabase
    .from('ACTIVITIES_EXCEPTIONS')
    .select('*', { count: 'exact' })
    .eq('id_activity', id_activity)
    .order('id', { ascending: true });

  if (!all && start_date && end_date) {
    query.gte('date', start_date).lte('date', end_date);
  } else if (!all && start_date) {
    query.gte('date', start_date);
  } else if (!all && end_date) {
    query.lte('date', end_date);
  }

  const { data, error, count } = await query;

  if (error) {
    return c.json({ error: 'Failed to fetch activities exceptions' }, 500);
  }

  const responseData = {
    data: data || [],
    count: count || 0,
  };

  return c.json(responseData, 200);
});
