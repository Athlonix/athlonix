import type { Database } from '@repo/types';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient<Database>(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '');

if (!supabase) throw new Error('Supabase client not created');

export const supAdmin = createClient<Database>(process.env.SUPABASE_URL || '', process.env.SUPABASE_SERVICE_KEY || '');

if (!supAdmin) throw new Error('Supabase admin client not created');
