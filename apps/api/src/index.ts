import {serve} from '@hono/node-server';
import {Hono} from 'hono';
import {prettyJSON} from 'hono/pretty-json';
import {secureHeaders} from 'hono/secure-headers';

const app = new Hono();
app.use(prettyJSON());
app.use(secureHeaders());

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

const port = Number(process.env.PORT || 3101);
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
