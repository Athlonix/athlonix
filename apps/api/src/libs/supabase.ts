import { exit } from 'node:process';
import type { Database } from '@repo/types';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient<Database>(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '');

if (!supabase) {
  console.error('Supabase client not created');
  console.log(process.env);
  exit(1);
}

export const supAdmin = createClient<Database>(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_KEY || '');

if (!supAdmin) {
  console.error('Supabase admin client not created');
  exit(1);
}
