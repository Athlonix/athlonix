import { OpenAPIHono } from '@hono/zod-openapi';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import {
  commentOnPost,
  createPost,
  createResponse,
  deletePost,
  getAllPosts,
  getComments,
  getPost,
  updatePost,
} from '../routes/blog.js';

type Variables = {
  user: {
    id: number;
  };
};

export const blog = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

blog.openapi(getAllPosts, async (c) => {
  const { data, error } = await supabase.from('POSTS').select('*');

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json(data, 200);
});

blog.openapi(getPost, async (c) => {
  const { id } = c.req.valid('param');
  const { data, error } = await supabase.from('POSTS').select('*').eq('id', id).single();

  if (error || !data) {
    return c.json({ error: error?.message || 'Post not found' }, 404);
  }

  return c.json(data, 200);
});

blog.openapi(createPost, async (c) => {
  const { title, content } = c.req.valid('json');
  const user = c.get('user')?.id;

  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  const { data: idUser } = await supabase.from('USERS').select('id').eq('id_auth', user).single();

  if (!idUser) {
    return c.json({ error: 'User not found' }, 404);
  }

  const { data, error } = await supabase
    .from('POSTS')
    .insert({ title, content, id_user: idUser?.id })
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: error?.message || 'Failed to create post' }, 500);
  }

  return c.json(data, 201);
});

blog.openapi(updatePost, async (c) => {
  const { id } = c.req.valid('param');
  const { title, content } = c.req.valid('json');
  const { data, error } = await supabase.from('POSTS').update({ title, content }).eq('id', id).select().single();

  if (error) {
    return c.json({ error: error.message }, 500);
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
    return c.json({ error: error.message }, 500);
  }
  if (count === 0) {
    return c.json({ error: 'Post not found' }, 404);
  }

  return c.json({ message: 'Post deleted successfully' }, 200);
});

blog.openapi(commentOnPost, async (c) => {
  const { id } = c.req.valid('param');
  const { content } = c.req.valid('json');
  const user = c.get('user')?.id;

  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  const { data, error } = await supabase
    .from('COMMENTS')
    .insert({ content, id_post: id, id_user: user })
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: error.message || 'Failed to create comment' }, 500);
  }

  return c.json(data, 201);
});

blog.openapi(getComments, async (c) => {
  const { id } = c.req.valid('param');
  const { data, error } = await supabase.from('COMMENTS').select('*').eq('id_post', id);

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json(data, 200);
});

blog.openapi(createResponse, async (c) => {
  const { id, id_comment } = c.req.valid('param');
  const { content } = c.req.valid('json');
  const user = c.get('user')?.id;

  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  const { data, error } = await supabase
    .from('COMMENTS')
    .insert({ content, id_post: id, id_comment, id_user: user })
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: error?.message || 'Failed to create response' }, 500);
  }

  return c.json(data, 201);
});
