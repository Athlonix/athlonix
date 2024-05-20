import { supabase } from './supabase.js';

export async function handleDonations(email: string, amount: number, receipt_url: string) {
  if (!email || !amount || !receipt_url) {
    return { error: 'Missing required fields' };
  }

  if (amount < 1) {
    return { error: 'Invalid amount' };
  }

  const { data: user } = await supabase.from('USERS').select('id').eq('email', email).single();

  let id_user: null | number = null;
  if (user) {
    id_user = user.id;
  }

  const { error, data } = await supabase.from('DONATIONS').insert({ amount, receipt_url, id_user }).select();

  if (error) {
    return { error: error.message };
  }

  return { data };
}
