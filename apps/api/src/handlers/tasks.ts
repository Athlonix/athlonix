import { OpenAPIHono } from '@hono/zod-openapi';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import { createTask, deleteTask, getAllActivityTasks, getAllTasks, getOneTask, updateTask } from '../routes/tasks.js';
import { checkRole } from '../utils/context.js';
import { getPagination } from '../utils/pagnination.js';
import type { Variables } from '../validators/general.js';

export const tasks = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

tasks.openapi(getAllActivityTasks, async (c) => {
  const { start_date, end_date, skip, take } = c.req.valid('query');
  const { id } = c.req.valid('param');

  const activitiesExceptions = supabase
    .from('ACTIVITIES_EXCEPTIONS')
    .select('id')
    .gte('date', start_date)
    .lte('date', end_date)
    .eq('id_activity', id)
    .order('date', { ascending: true });

  const { data: exceptions, error: exceptionsError } = await activitiesExceptions;

  if (exceptionsError) {
    return c.json({ error: 'Failed to fetch tasks' }, 500);
  }

  const idExceptions = exceptions.map((e) => e.id);

  const query = supabase
    .from('ACTIVITIES_TASKS')
    .select('*, employee:USERS(id, username),occurence:ACTIVITIES_EXCEPTIONS(date)', { count: 'exact' })
    .in('id_activity_exception', idExceptions);

  const { from, to } = getPagination(skip, take - 1);
  query.range(from, to);

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

tasks.openapi(getAllTasks, async (c) => {
  const { search, all, skip, take } = c.req.valid('query');
  const { id } = c.req.valid('param');

  const query = supabase.from('ACTIVITIES_TASKS').select('*', { count: 'exact' }).eq('id_activity_exception', id);

  if (search) {
    query.ilike('title', `%${search}%`);
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

tasks.openapi(getOneTask, async (c) => {
  const { id } = c.req.valid('param');
  const { data, error } = await supabase.from('ACTIVITIES_TASKS').select('*').eq('id', id).single();

  if (error || !data) {
    return c.json({ error: 'Task not found' }, 404);
  }

  return c.json(data, 200);
});

tasks.openapi(createTask, async (c) => {
  const { title, description, status, priority, id_employee } = c.req.valid('json');
  const { id: id_activity_exception } = c.req.valid('param');

  const user = c.get('user');
  const roles = user.roles;

  await checkRole(roles, false);

  const { data: activityFound, error } = await supabase
    .from('ACTIVITIES_EXCEPTIONS')
    .select('id,id_activity')
    .eq('id', id_activity_exception)
    .single();

  if (error) {
    return c.json({ error: 'Error while executing request' }, 500);
  }

  if (!activityFound) {
    return c.json({ error: 'Activity exception not found' }, 404);
  }

  if (id_employee != null) {
    const { data: teamMembers, error: teamError } = await supabase
      .from('ACTIVITY_TEAMS')
      .select('id_user')
      .eq('id_activity', activityFound.id_activity);
    if (error || !teamMembers) {
      return c.json({ error: 'Error while executing request' }, 500);
    }
    const idMembers: number[] = teamMembers?.map((m) => m.id_user) as number[];

    const { data: employeeValid, error: employeeError } = await supabase
      .from('USERS')
      .select('id')
      .eq('id', id_employee)
      .in('id', idMembers)
      .single();
    if (employeeError || !employeeValid) {
      return c.json({ error: 'employee in not part of the activity team' }, 404);
    }
  }

  const { data, error: insertError } = await supabase
    .from('ACTIVITIES_TASKS')
    .insert({
      title,
      id_activity_exception,
      description,
      status,
      priority,
      id_employee,
    })
    .select()
    .single();

  if (insertError || !data) {
    return c.json({ error: 'Error while executing request' }, 500);
  }

  return c.json(data, 201);
});

tasks.openapi(deleteTask, async (c) => {
  const { id } = c.req.valid('param');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { error, count } = await supabase.from('ACTIVITIES_TASKS').delete({ count: 'exact' }).eq('id', id);

  if (error || count === 0) {
    return c.json({ error: 'Task not found' }, 404);
  }

  return c.json({ message: `Task with id ${id} deleted` }, 200);
});

tasks.openapi(updateTask, async (c) => {
  const { id } = c.req.valid('param');
  const { title, description, status, priority, id_employee } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);

  const { data, error } = await supabase
    .from('ACTIVITIES_TASKS')
    .update({ title, description, status, priority, id_employee })
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: 'Failed to update task' }, 400);
  }

  return c.json(data, 200);
});
