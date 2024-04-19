import { OpenAPIHono } from '@hono/zod-openapi';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import {
  commentOnPost,
  createPost,
  createResponse,
  deleteComment,
  deletePost,
  getAllPosts,
  getComments,
  getPost,
  updateComment,
  updatePost,
} from '../routes/blog.js';
import { checkRole } from '../utils/context.js';
import { getPagination } from '../utils/pagnination.js';
import type { Variables } from '../validators/general.js';
import { Role } from '../validators/general.js';

export const blog = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

blog.openapi(getAllPosts, async (c) => {
  const { skip, take } = c.req.valid('query');
  const { from, to } = getPagination(skip, take - 1);
  const { data, error } = await supabase.from('POSTS').select('*').range(from, to);

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json(data, 200);
});

blog.openapi(getPost, async (c) => {
  const { id } = c.req.valid('param');
  const { data, error } = await supabase.from('POSTS').select('*').eq('id', id).single();

  if (error || !data) {
    return c.json({ error: 'Post not found' }, 404);
  }

  return c.json(data, 200);
});

blog.openapi(createPost, async (c) => {
  const { title, content, cover_image } = c.req.valid('json');
  const user = c.get('user');
  const id_user = user.id;
  await checkRole(user.roles, false, [Role.REDACTOR, Role.MODERATOR]);

  const { data, error } = await supabase
    .from('POSTS')
    .insert({ title, content, id_user, cover_image })
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: 'Failed to create post' }, 400);
  }

  return c.json(data, 201);
});

blog.openapi(updatePost, async (c) => {
  const { id } = c.req.valid('param');
  const { title, content, cover_image } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false, [Role.REDACTOR, Role.MODERATOR]);
  const { data, error } = await supabase
    .from('POSTS')
    .update({ title, content, cover_image, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('id_user', user.id)
    .select()
    .single();
  if (error || !data) {
    return c.json({ error: 'Post not found' }, 404);
  }

  return c.json(data, 200);
});

blog.openapi(deletePost, async (c) => {
  const { id } = c.req.valid('param');
  const user = c.get('user');
  const roles = user.roles;
  const id_user = user.id;
  await checkRole(roles, false, [Role.REDACTOR, Role.MODERATOR]);

  const allowed = [Role.MODERATOR, Role.ADMIN, Role.DIRECTOR];
  if (roles?.some((role) => allowed.includes(role))) {
    const { error, count } = await supabase.from('POSTS').delete({ count: 'exact' }).eq('id', id);

    if (error || count === 0) {
      return c.json({ error: 'Post not found' }, 404);
    }

    return c.json({ message: 'Post deleted successfully' }, 200);
  }

  const { error, count } = await supabase.from('POSTS').delete({ count: 'exact' }).eq('id', id).eq('id_user', id_user);

  if (error || count === 0) {
    return c.json({ error: 'Post not found' }, 404);
  }

  return c.json({ message: 'Post deleted successfully' }, 200);
});

blog.openapi(commentOnPost, async (c) => {
  const { id } = c.req.valid('param');
  const { content } = c.req.valid('json');
  const user = c.get('user');
  const id_user = user.id;
  await checkRole(user.roles, true);

  const { data, error } = await supabase.from('COMMENTS').insert({ content, id_post: id, id_user }).select().single();

  if (error || !data) {
    return c.json({ error: 'Post not found' }, 404);
  }

  return c.json(data, 201);
});

blog.openapi(getComments, async (c) => {
  const { id } = c.req.valid('param');
  const { skip, take } = c.req.valid('query');
  const { from, to } = getPagination(skip, take - 1);
  const { data, error } = await supabase.from('COMMENTS').select('*').eq('id_post', id).range(from, to);

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json(data, 200);
});

blog.openapi(createResponse, async (c) => {
  const { id_post, id_comment } = c.req.valid('param');
  const { content } = c.req.valid('json');
  const user = c.get('user');
  const id_user = user.id;
  await checkRole(user.roles, true);

  const { data, error } = await supabase
    .from('COMMENTS')
    .insert({ content, id_post, id_response: id_comment, id_user })
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: 'Failed to create response' }, 400);
  }

  return c.json(data, 201);
});

blog.openapi(updateComment, async (c) => {
  const { id_post, id_comment } = c.req.valid('param');
  const { content } = c.req.valid('json');
  const user = c.get('user');
  await checkRole(user.roles, true);

  const { data, error } = await supabase
    .from('COMMENTS')
    .update({ content })
    .eq('id', id_comment)
    .eq('id_post', id_post)
    .eq('id_user', user.id)
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: 'Comment not found' }, 404);
  }

  return c.json(data, 200);
});

blog.openapi(deleteComment, async (c) => {
  const { id_post, id_comment } = c.req.valid('param');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(user.roles, true);

  const allowed = [Role.MODERATOR, Role.ADMIN, Role.DIRECTOR];
  if (roles?.some((role) => allowed.includes(role))) {
    const { error, count } = await supabase
      .from('COMMENTS')
      .delete({ count: 'exact' })
      .eq('id', id_comment)
      .eq('id_post', id_post);

    if (error || count === 0) {
      return c.json({ error: 'Comment not found' }, 404);
    }

    return c.json({ message: 'Comment deleted successfully' }, 200);
  }

  const { error, count } = await supabase
    .from('COMMENTS')
    .delete({ count: 'exact' })
    .eq('id', id_comment)
    .eq('id_post', id_post)
    .eq('id_user', user.id);

  if (error || count === 0) {
    return c.json({ error: 'Comment not found' }, 404);
  }

  return c.json({ message: 'Comment deleted successfully' }, 200);
});
