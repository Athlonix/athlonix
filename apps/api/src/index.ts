import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import type { Context } from 'hono';
import { compress } from 'hono/compress';
import { cors } from 'hono/cors';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { activities } from './handlers/activities.js';
import { assemblies } from './handlers/assemblies.js';
import { auth } from './handlers/auth.js';
import { blog } from './handlers/blog.js';
import { edm } from './handlers/edm.js';
import { health } from './handlers/health.js';
import { location } from './handlers/location.js';
import { materials } from './handlers/materials.js';
import { messages } from './handlers/messages.js';
import { proposals } from './handlers/proposals.js';
import { reasons } from './handlers/reasons.js';
import { reports } from './handlers/reports.js';
import { sports } from './handlers/sports.js';
import { stats } from './handlers/stats.js';
import { stripe } from './handlers/stripe.js';
import { tasks } from './handlers/tasks.js';
import { activities_teams } from './handlers/teams.js';
import { tournaments } from './handlers/tournaments.js';
import { users } from './handlers/users.js';
import { polls } from './handlers/votes.js';

const app = new OpenAPIHono();

if (!process.env.CI === true) {
  app.use('*', logger());
}
app.use('*', prettyJSON());
app.use('*', secureHeaders());
app.use('*', compress());
app.use(
  '*',
  cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);
app.get('/', (c) => c.text('Athlonix API!', 200));

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status || 500);
  }
  return c.json({ error: 'Internal server error' }, 500);
});

app.route('/', health);
app.route('/auth', auth);
app.route('/', users);
app.route('/', activities);
app.route('/', sports);
app.route('/', location);
app.route('/', polls);
app.route('/', blog);
app.route('/', reasons);
app.route('/', reports);
app.route('/', proposals);
app.route('/', tournaments);
app.route('/', activities_teams);
app.route('/', stripe);
app.route('/', assemblies);
app.route('/', tasks);
app.route('/', edm);
app.route('/', stats);
app.route('/', materials);
app.route('/', messages);

app.doc('/doc', (c: Context) => ({
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Athlonix API',
  },
  servers: [
    {
      url: new URL(c.req.url).origin,
      description: 'Development server',
    },
    {
      url: 'https://athlonix-api.jayllyz.fr',
      description: 'Production server',
    },
  ],
}));

app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

app.get('/ui', swaggerUI({ url: '/doc' }));

const port = Number(process.env.PORT || 3101);
console.info(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

export default app;
