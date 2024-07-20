import { OpenAPIHono } from '@hono/zod-openapi';
import { uploadFile } from '../libs/storage.js';
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
  softDeletePost,
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
  const { all, search, skip, take } = c.req.valid('query');

  const query = supabase
    .from('POSTS')
    .select(
      `id,title,created_at,cover_image,description,
      author:USERS!public_POSTS_user_id_fkey(id,username),
      categories:POSTS_CATEGORIES(CATEGORIES(id,name)),
      comments_number:COMMENTS(count),
      views_number:POSTS_VIEWS(count),
      likes_number:POSTS_REACTIONS(count),
      comments:COMMENTS(id),
      reports:REPORTS(id)`,
      { count: 'exact' },
    )
    .filter('deleted_at', 'is', null)
    .order('id', { ascending: true });

  if (search) {
    query.ilike('title', `%${search}%`);
  }

  if (!all) {
    const { from, to } = getPagination(skip, take - 1);
    query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error || !data) {
    return c.json({ error: error.message }, 500);
  }

  const finalData = data.map((row) => {
    return {
      ...row,
      author: row.author ? { id: row.author.id, username: row.author.username } : null,
      categories: row.categories
        ? row.categories.map((category) => ({
            id: category.CATEGORIES?.id ?? null,
            name: category.CATEGORIES?.name ?? null,
          }))
        : [],
      comments_number: row.comments_number[0]?.count || 0,
      views_number: row.views_number[0]?.count || 0,
      likes_number: row.likes_number[0]?.count || 0,
    };
  });

  return c.json({ data: finalData, count: count || 0 }, 200);
});

blog.openapi(getPost, async (c) => {
  const { id } = c.req.valid('param');

  const { data, error } = await supabase
    .from('POSTS')
    .select(
      `id,title,content,created_at,cover_image,description,
      author:USERS!public_POSTS_user_id_fkey(id,username),
      categories:POSTS_CATEGORIES(CATEGORIES(id,name)),
      comments_number:COMMENTS(count),
      views_number:POSTS_VIEWS(count),
      likes_number:POSTS_REACTIONS(count),
      comments:COMMENTS(id,content,created_at,author:USERS!public_COMMENTS_id_user_fkey(id,username)),
      reports:REPORTS(id)`,
    )
    .eq('id', id)
    .single();

  if (error || !data) {
    return c.json({ error: 'Post not found' }, 404);
  }

  const finalData = {
    ...data,
    author: data.author ? { id: data.author.id, username: data.author.username } : null,
    categories: data.categories
      ? data.categories.map((category) => ({
          id: category.CATEGORIES?.id ?? null,
          name: category.CATEGORIES?.name ?? null,
        }))
      : [],
    comments_number: data.comments_number[0]?.count || 0,
    views_number: data.views_number[0]?.count || 0,
    likes_number: data.likes_number[0]?.count || 0,
  };

  return c.json(finalData, 200);
});

blog.openapi(createPost, async (c) => {
  const { title, content, cover_image, description } = c.req.valid('form');
  const user = c.get('user');
  const id_user = user.id;
  await checkRole(user.roles, false, [Role.REDACTOR, Role.MODERATOR, Role.ADMIN]);

  let coverImageName = '';
  if (cover_image) {
    try {
      coverImageName = crypto.randomUUID();
    } catch (exception) {
      console.log(exception);
    }
  }

  const { data, error } = await supabase
    .from('POSTS')
    .insert({ title, content, id_user, cover_image: coverImageName, description })
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: 'Failed to create post' }, 400);
  }

  if (cover_image) {
    await uploadFile(`blog_posts/${coverImageName}`, cover_image, 'image');
  }

  return c.json(data, 201);
});

blog.openapi(updatePost, async (c) => {
  const { id } = c.req.valid('param');
  const { title, content, cover_image, description } = c.req.valid('json');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false, [Role.REDACTOR, Role.MODERATOR]);

  const { data, error } = await supabase
    .from('POSTS')
    .update({ title, content, cover_image, description, updated_at: new Date().toISOString() })
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
  await checkRole(roles, true, [Role.REDACTOR, Role.MODERATOR]);

  const isAdmin = roles?.some((role) => [Role.MODERATOR, Role.ADMIN, Role.PRESIDENT].includes(role));
  const query = supabase.from('POSTS').delete({ count: 'exact' }).eq('id', id);

  if (!isAdmin) {
    query.eq('id_user', user.id);
  }

  const { error, count } = await query;

  if (error || count === 0) {
    return c.json({ error: 'Post not found or you do not have permission to delete it' }, 404);
  }

  return c.json({ message: 'Post permanently deleted successfully' }, 200);
});

blog.openapi(softDeletePost, async (c) => {
  const { id } = c.req.valid('param');
  const user = c.get('user');
  const roles = user.roles;

  const isAdminOrModerator = roles?.some((role) => [Role.MODERATOR, Role.ADMIN, Role.PRESIDENT].includes(role));

  const updateData = {
    content: '[supprimé]',
    title: '[supprimé]',
    cover_image: null,
    description: null,
    deleted_at: new Date().toISOString(),
  };

  const query = supabase.from('POSTS').update(updateData).eq('id', id);

  if (!isAdminOrModerator) {
    query.eq('id_user', user.id);
  }

  const { data, error } = await query.select().single();

  if (error || !data) {
    return c.json({ error: 'Post not found or you do not have permission to delete it' }, 404);
  }

  return c.json({ message: 'Post soft deleted successfully' }, 200);
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
  const { all, search, skip, take } = c.req.valid('query');

  const query = supabase
    .from('COMMENTS')
    .select('*', { count: 'exact' })
    .eq('id_post', id)
    .order('id', { ascending: true });

  if (search) {
    query.ilike('content', `%${search}%`);
  }

  if (!all) {
    const { from, to } = getPagination(skip, take - 1);
    query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    return c.json({ error: "Failed to get comments, verify the post's id" }, 400);
  }

  return c.json({ data, count: count || 0 }, 200);
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

  const isAdmin = roles?.some((role) => [Role.MODERATOR, Role.ADMIN, Role.PRESIDENT].includes(role));
  const query = supabase.from('COMMENTS').delete({ count: 'exact' }).eq('id', id_comment).eq('id_post', id_post);

  if (!isAdmin) {
    query.eq('id_user', user.id);
  }

  const { error, count } = await query;

  if (error || count === 0) {
    return c.json({ error: 'Comment not found or you do not have permission to delete it' }, 404);
  }

  return c.json({ message: 'Comment deleted successfully' }, 200);
});
