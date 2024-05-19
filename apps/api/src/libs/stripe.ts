import { supabase } from './supabase.js';

export async function handleDonations(email: string, amount: number, receipt_url: string) {
  if (!email || !amount || !receipt_url) {
    return { error: 'Missing required fields' };
  }

  if (amount < 1) {
    return { error: 'Invalid amount' };
  }

  const { data: user, error: userError } = await supabase.from('USERS').select('id').eq('email', email).single();

  if (userError) {
    return { error: userError.message };
  }

  const { error, data } = await supabase
    .from('DONATIONS')
    .insert({ email, amount, receipt_url, id_user: user.id ?? null })
    .single();

  if (error) {
    return { error: error.message };
  }
  console.log(data);

  return { data };
}
