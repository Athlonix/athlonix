import { OpenAPIHono } from '@hono/zod-openapi';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import { createTask } from '../routes/tasks.js';
import { checkRole } from '../utils/context.js';
import { Role, type Variables } from '../validators/general.js';

export const activities = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

activities.openapi(createTask, async (c) => {
  const { title, description, status, priority, id_employee } = c.req.valid('json');
  const { id_activity } = c.req.valid('param');

  const user = c.get('user');
  const roles = user.roles;

  await checkRole(roles, false);

  const { data: activityFound, error } = await supabase.from('ACTIVITIES').select('id').eq('id', id_activity).single();

  if (error) {
    return c.json({ error: 'Error while executing request' }, 500);
  }

  if (!activityFound) {
    return c.json({ error: 'Activity not found' }, 404);
  }

  const { data, error: insertError } = await supabase.from('ACTIVITIES_EXCEPTIONS').insert({
    title,
    description,
    status,
    priority,
    id_employee,
    id_activity,
  });

  return c.json(data, 201);
});
