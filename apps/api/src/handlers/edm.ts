import { OpenAPIHono } from '@hono/zod-openapi';
import { deleteFile, uploadFile, upsertFile } from '../libs/storage.js';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import { deleteFileRoute, updateFile, uploadFileRoute } from '../routes/edm.js';
import type { Variables } from '../validators/general.js';

export const edm = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

edm.openapi(uploadFileRoute, async (c) => {
  const { file } = c.req.valid('form');

  const { error } = await uploadFile('test', file, 'edm');
  if (error) {
    return c.json({ error }, 500);
  }

  return c.json({ message: 'File uploaded' }, 200);
});

edm.openapi(updateFile, async (c) => {
  const { file, path } = c.req.valid('form');

  const { error } = await upsertFile(path, file, 'edm');
  if (error) {
    return c.json({ error }, 500);
  }

  return c.json({ message: 'File updated' }, 200);
});

edm.openapi(deleteFileRoute, async (c) => {
  const { path } = c.req.valid('json');

  const { error } = await deleteFile(path, 'edm');
  if (error) {
    return c.json({ error }, 500);
  }

  return c.json({ message: 'File deleted' }, 200);
});
