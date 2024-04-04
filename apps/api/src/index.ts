import {serve} from '@hono/node-server';
import {Hono} from 'hono';
import {compress} from 'hono/compress';
import {prettyJSON} from 'hono/pretty-json';
import {secureHeaders} from 'hono/secure-headers';
import authRoutes from './handlers/auth.js';
import authMiddleware from './middlewares/auth.js';

const app = new Hono();
app.use(prettyJSON());
app.use(secureHeaders());
app.use(compress());

app.get('/', (c) => c.text('Hello, Hono!', 200));
app.route('/auth/', authRoutes);
app.get('/health', (c) => c.json('OK', 200));
app.get('/protected', authMiddleware, (c) => c.json({message: 'Protected route'}, 200));

const port = Number(process.env.PORT || 3101);
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
