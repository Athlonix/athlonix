import Stripe from 'stripe';
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

export async function handleSubscription(subscription: string, invoice: string) {
  if (!subscription || !invoice) {
    return { error: 'Missing required fields' };
  }

  const STRIPE_SECRET_API_KEY = process.env.STRIPE_SECRET_API_KEY as string;
  const stripe = new Stripe(STRIPE_SECRET_API_KEY);

  const invoiceDetails = await stripe.subscriptions.retrieve(subscription);

  if (!invoiceDetails) {
    return { error: 'Subscription not found' };
  }

  if (invoiceDetails.status !== 'active') {
    return { error: 'Subscription not active' };
  }

  const { email } = invoiceDetails.customer as Stripe.Customer;

  const { data: user, error: userDb } = await supabase
    .from('USERS')
    .select('id')
    .eq('email', email || '')
    .eq('subscription', subscription)
    .single();

  if (!user || userDb) {
    return { error: 'User not found' };
  }

  const id_user = user.id;
  const next_year = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleString();
  const { error, data } = await supabase
    .from('USERS')
    .update({ subscription, invoice, date_validity: next_year })
    .eq('id', id_user)
    .select();

  if (error) {
    return { error: error.message };
  }

  const { error: errorInsert } = await supabase.from('USERS_ROLES').insert({ id_user, id_role: Role.MEMBER });
  if (errorInsert) {
    return { error: errorInsert.message };
  }

  return { data };
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

  const { error: deleteRole } = await supabase.from('USERS_ROLES').delete().eq('id_user', id_user);

  if (deleteRole) {
    return { error: deleteRole.message };
  }

  return { data: 'Subscription revoked' };
}
