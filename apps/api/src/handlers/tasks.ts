import { OpenAPIHono } from '@hono/zod-openapi';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import { createTask, getAllTasks } from '../routes/tasks.js';
import { checkRole } from '../utils/context.js';
import { getPagination } from '../utils/pagnination.js';
import { Role, type Variables } from '../validators/general.js';

export const tasks = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
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

tasks.openapi(createTask, async (c) => {
  const { title, description, status, priority, id_employee } = c.req.valid('json');
  const { id: id_activity_exception } = c.req.valid('param');

  const user = c.get('user');
  const roles = user.roles;

  await checkRole(roles, false);

  const { data: activityFound, error } = await supabase
    .from('ACTIVITIES_EXCEPTIONS')
    .select('id')
    .eq('id', id_activity_exception)
    .single();

  if (error) {
    return c.json({ error: 'Error while executing request' }, 500);
  }

  if (!activityFound) {
    return c.json({ error: 'Activity exception not found' }, 404);
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

  if (error || !data) {
    return c.json({ error: 'Error while executing request' }, 500);
  }

  return c.json(data, 201);
});
