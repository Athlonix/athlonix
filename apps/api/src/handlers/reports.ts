import { OpenAPIHono } from '@hono/zod-openapi';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import { createReport, createReportComment, deleteReport, getReportComments, getReports } from '../routes/reports.js';
import { checkRole } from '../utils/context.js';
import { getPagination } from '../utils/pagnination.js';
import type { Variables } from '../validators/general.js';
import { Role } from '../validators/general.js';

export const reports = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

reports.openapi(getReports, async (c) => {
  const { id_post } = c.req.valid('param');
  const { all, skip, take } = c.req.valid('query');

  const query = supabase
    .from('REPORTS')
    .select('*', { count: 'exact' })
    .eq('id_post', id_post)
    .order('id', { ascending: true });

  if (!all) {
    const { from, to } = getPagination(skip, take - 1);
    query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    return c.json({ error: 'Failed to get reports' }, 500);
  }

  const responseData = {
    data: data || [],
    count: count || 0,
  };

  return c.json(responseData, 200);
});

reports.openapi(createReport, async (c) => {
  const { id_post } = c.req.valid('param');
  const { id_reason, content } = c.req.valid('json');
  const user = c.get('user');
  const id_user = user.id;
  await checkRole(user.roles, true);

  const { data, error } = await supabase
    .from('REPORTS')
    .insert({ id_reason, content, id_post, id_user })
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: 'Failed to create report' }, 400);
  }

  return c.json(data, 201);
});

reports.openapi(deleteReport, async (c) => {
  const { id } = c.req.valid('param');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(user.roles, true);

  const allowed = [Role.MODERATOR, Role.ADMIN, Role.DIRECTOR];
  if (roles?.some((role) => allowed.includes(role))) {
    const { error, count } = await supabase.from('REPORTS').delete({ count: 'exact' }).eq('id', id);

    if (error || count === 0) {
      return c.json({ error: 'Report not found' }, 404);
    }

    return c.json({ message: 'Report deleted successfully' }, 200);
  }

  const { error, count } = await supabase
    .from('REPORTS')
    .delete({ count: 'exact' })
    .eq('id', id)
    .eq('id_user', user.id);

  if (error || count === 0) {
    return c.json({ error: 'Report not found' }, 404);
  }

  return c.json({ message: 'Report deleted successfully' }, 200);
});

reports.openapi(getReportComments, async (c) => {
  const { id_comment } = c.req.valid('param');
  const { all, skip, take } = c.req.valid('query');

  const query = supabase
    .from('REPORTS')
    .select('*', { count: 'exact' })
    .eq('id_comment', id_comment)
    .order('id', { ascending: true });

  if (!all) {
    const { from, to } = getPagination(skip, take - 1);
    query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    return c.json({ error: 'Failed to get comments' }, 400);
  }

  const responseData = {
    data: data || [],
    count: count || 0,
  };

  return c.json(responseData, 200);
});

reports.openapi(createReportComment, async (c) => {
  const { id_comment } = c.req.valid('param');
  const { content, id_reason } = c.req.valid('json');
  const user = c.get('user');
  const id_user = user.id;
  await checkRole(user.roles, true);

  const { data, error } = await supabase
    .from('REPORTS')
    .insert({ id_reason, content, id_comment, id_user })
    .select()
    .single();

  if (error || !data) {
    return c.json({ error: 'Failed to create comment' }, 400);
  }

  return c.json(data, 201);
});
