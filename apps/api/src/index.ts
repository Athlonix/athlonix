import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import authRoutes from './handlers/auth.js';
import { blog } from './handlers/blog.js';

const app = new Hono();

if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  app.use(logger());
}
app.use(prettyJSON());
app.use(secureHeaders());
app.use(compress());

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  return c.json({ message: 'Internal server error' }, 500);
});

app.get('/', (c) => c.text('Hello, Hono!', 200));
app.route('/auth/', authRoutes);
app.get('/health', (c) => c.json('OK', 200));
app.route('/blog', blog);

const port = Number(process.env.PORT || 3101);
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
