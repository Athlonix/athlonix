import type Stripe from 'stripe';
import { Role } from '../validators/general.js';
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

export async function handleSubscription(subscription: string, invoice: string, email: string) {
  if (!subscription || !invoice || !email) {
    return { error: 'Missing required fields' };
  }

  const { data: user, error: userDb } = await supabase
    .from('USERS')
    .select('id, subscription, date_validity')
    .eq('email', email)
    .single();

  if (!user || userDb) {
    return { error: 'User not found' };
  }

  if (user.subscription !== null && user.subscription !== subscription) {
    return { error: 'Wrong subscription' };
  }

  const id_user = user.id;
  const next_year = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleString();

  const { error } = await supabase
    .from('USERS')
    .update({ subscription, invoice, date_validity: next_year })
    .eq('id', id_user)
    .select();

  if (error) {
    return { error: error.message };
  }

  if (user.subscription === null) {
    // first subscription for this user
    const { error: errorInsert } = await supabase.from('USERS_ROLES').insert({ id_user, id_role: Role.MEMBER });

    if (errorInsert) {
      return { error: errorInsert.message };
    }
  }

  return { data: 'Subscription updated' };
}

export async function handleRevokeSubscription(customer: Stripe.Customer) {
  if (!customer) {
    return { error: 'Customer not found' };
  }

  const { email } = customer;

  const { data: userDb, error: errorUser } = await supabase
    .from('USERS')
    .select('id')
    .eq('email', email || '')
    .single();

  if (errorUser || !userDb) {
    return { error: 'User not found' };
  }

  const id_user = userDb.id;

  const { error: deleteSub } = await supabase.from('USERS').update({ date_validity: null }).eq('id', id_user);

  if (deleteSub) {
    return { error: deleteSub.message };
  }

  return { data: 'Subscription revoked' };
}
