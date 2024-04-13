import { OpenAPIHono } from '@hono/zod-openapi';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import { createPost, deletePost, getAllPosts, getPost, updatePost } from '../routes/blog.js';

export const blog = new OpenAPIHono({
  defaultHook: zodErrorHook,
});

blog.openapi(getAllPosts, async (c) => {
  const { data, error } = await supabase.from('POSTS').select('*');

  if (error) {
    return c.json({ message: error.message }, 500);
  }

  return c.json(data, 200);
});

blog.openapi(getPost, async (c) => {
  const { id } = c.req.valid('param');
  const { data, error } = await supabase.from('POSTS').select('*').eq('id', id).single();

  if (error) {
    return c.json({ message: error.message }, 500);
  }
  if (!data) {
    return c.json({ message: 'Post not found' }, 404);
  }

  return c.json(data, 200);
});

blog.openapi(createPost, async (c) => {
  const { title, content, id_user } = c.req.valid('json');
  const { data, error } = await supabase.from('POSTS').insert({ title, content, id_user }).select().single();

  if (error) {
    return c.json({ message: error.message }, 500);
  }

  return c.json(data, 201);
});

blog.openapi(updatePost, async (c) => {
  const { id } = c.req.valid('param');
  const { title, content } = c.req.valid('json');
  const { data, error } = await supabase.from('POSTS').update({ title, content }).eq('id', id).select().single();

  if (error) {
    return c.json({ message: error.message }, 500);
  }
  if (!data) {
    return c.json({ message: 'Post not found' }, 404);
  }

  return c.json(data, 200);
});

blog.openapi(deletePost, async (c) => {
  const { id } = c.req.valid('param');
  const { error, count } = await supabase.from('POSTS').delete({ count: 'exact' }).eq('id', id);

  if (error) {
    return c.json({ message: error.message }, 500);
  }
  if (count === 0) {
    return c.json({ message: 'Post not found' }, 404);
  }

  return c.json({ message: 'Post deleted successfully' }, 200);
});
