import { OpenAPIHono } from '@hono/zod-openapi';
import { supabase } from '../libs/supabase.js';
import { dbHealthCheck, healthCheck } from '../routes/health.js';

export const health = new OpenAPIHono();

health.openapi(healthCheck, (c) => {
  return c.json('OK', 200);
});

health.openapi(dbHealthCheck, (c) => {
  if (supabase) {
    return c.json('OK', 200);
  }
  return c.json({ error: 'Database connection error' }, 500);
});
