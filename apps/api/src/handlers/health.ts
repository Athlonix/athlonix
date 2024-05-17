import { OpenAPIHono } from '@hono/zod-openapi';
import { healthCheck } from '../routes/health.js';

export const health = new OpenAPIHono();

health.openapi(healthCheck, (c) => {
  return c.json('OK', 200);
});
