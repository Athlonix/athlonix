import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { z } from 'zod';
import { supabase } from '../libs/supabase.js';
import authMiddleware from '../middlewares/auth.js';

export const blog = new Hono();

blog.get('/posts', authMiddleware, async (c) => {
  const { data, error } = await supabase.from('POSTS').select('*');

  if (error) {
    throw new HTTPException(500, { message: error.message });
  }

  return c.json(data, 200);
});

blog.get(
  '/posts/:postId',
  authMiddleware,
  zValidator(
    'param',
    z.object({
      postId: z.string(),
    }),
  ),
  async (c) => {
    const { postId } = c.req.valid('param');
    const { data, error } = await supabase.from('POSTS').select('*').eq('id', postId).single();

    if (error) {
      throw new HTTPException(500, { message: error.message });
    }
    if (!data) {
      return c.json({ message: 'Post not found' }, 404);
    }

    return c.json(data, 200);
  },
);

blog.post(
  '/posts',
  authMiddleware,
  zValidator(
    'json',
    z.object({
      title: z.string(),
      content: z.string(),
    }),
  ),
  async (c) => {
    const { title, content } = c.req.valid('json');
    const { data, error } = await supabase.from('POSTS').insert({ title, content }).select().single();

    if (error) {
      throw new HTTPException(500, { message: error.message });
    }

    return c.json(data, 201);
  },
);

blog.delete(
  '/posts/:postId',
  authMiddleware,
  zValidator(
    'param',
    z.object({
      postId: z.string(),
    }),
  ),

  async (c) => {
    const { postId } = c.req.valid('param');

    const { error, count } = await supabase.from('POSTS').delete({ count: 'exact' }).eq('id', postId);

    if (error) {
      throw new HTTPException(500, { message: error.message });
    }
    if (count === 0) {
      return c.json({ message: 'Post not found' }, 404);
    }

    return c.json({ message: 'Post deleted successfully' }, 200);
  },
);

blog.patch(
  '/posts/:postId',
  authMiddleware,
  zValidator(
    'param',
    z.object({
      postId: z.string(),
    }),
  ),
  zValidator(
    'json',
    z.object({
      title: z.string(),
      content: z.string(),
    }),
  ),
  async (c) => {
    const { postId } = c.req.valid('param');
    const { title, content } = c.req.valid('json');

    const { data, error } = await supabase.from('POSTS').update({ title, content }).eq('id', postId).select().single();

    if (error) {
      throw new HTTPException(500, { message: error.message });
    }
    if (!data) {
      return c.json({ message: 'Post not found' }, 404);
    }

    return c.json(data, 200);
  },
);
