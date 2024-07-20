import { OpenAPIHono } from '@hono/zod-openapi';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import { createProposal, deleteProposal, getAllProposals } from '../routes/proposals.js';
import { checkRole } from '../utils/context.js';
import { getPagination } from '../utils/pagnination.js';
import type { Variables } from '../validators/general.js';

export const proposals = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

proposals.openapi(getAllProposals, async (c) => {
  const { all, search, skip, take } = c.req.valid('query');
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, true);

  const query = supabase
    .from('PROPOSALS')
    .select(
      `
      *,
      user:USERS(first_name, last_name)
    `,
      { count: 'exact' },
    )
    .order('created_at', { ascending: false });

  if (!all) {
    const { from, to } = getPagination(skip, take - 1);
    query.range(from, to);
  }

  if (search) {
    query.ilike('proposal', `%${search}%`);
  }

  const { data, error, count } = await query;

  if (error || !data) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({ data, count: count || 0 }, 200);
});

proposals.openapi(createProposal, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, true);

  const { proposal } = c.req.valid('json');
  const { data, error } = await supabase
    .from('PROPOSALS')
    .insert({
      proposal,
      id_user: user.id,
    })
    .select()
    .single();

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json(data, 201);
});

proposals.openapi(deleteProposal, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, true);
  const { id } = c.req.valid('param');
  const { error } = await supabase.from('PROPOSALS').delete().eq('id', id).eq('id_user', user.id);

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({ message: 'Proposal deleted' }, 200);
});
