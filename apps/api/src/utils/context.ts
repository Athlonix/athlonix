import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { supabase } from '../libs/supabase.js';

export async function getUserId(c: Context): Promise<number> {
  const id_auth = c.get('user')?.id_auth;

  const { data: user } = await supabase.from('USERS').select('id').eq('id_auth', id_auth).single();

  if (!user) throw new HTTPException(404, { message: 'User not found' });

  return user.id;
}
