import { OpenAPIHono } from '@hono/zod-openapi';
import Stripe from 'stripe';
import { handleDonations, handleRevokeSubscription, handleSubscription } from '../libs/stripe.js';
import { supabase } from '../libs/supabase.js';
import { zodErrorHook } from '../libs/zodError.js';
import { listDonations, webhook } from '../routes/stripe.js';
import { checkRole } from '../utils/context.js';
import { getPagination } from '../utils/pagnination.js';
import type { Variables } from '../validators/general.js';

export const stripe = new OpenAPIHono<{ Variables: Variables }>({
  defaultHook: zodErrorHook,
});

stripe.openapi(webhook, async (context) => {
  const STRIPE_API_KEY = process.env.STRIPE_API_KEY as string;
  const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;
  const stripe = new Stripe(STRIPE_API_KEY);
  const signature = context.req.header('stripe-signature');
  if (!signature) {
    return context.json({ error: 'No signature' }, 400);
  }
  const payload = await context.req.text();
  const event = await stripe.webhooks.constructEventAsync(payload, signature, STRIPE_WEBHOOK_SECRET);

  switch (event.type) {
    case 'charge.succeeded': {
      const email = event.data.object.receipt_email || 'test@email.com';
      const amount = event.data.object.amount / 100;
      const receipt_url = event.data.object.receipt_url as string;
      const data = await handleDonations(email, amount, receipt_url);
      if (data.error) {
        return context.json({ error: data.error }, 400);
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      const customer = (await stripe.customers.retrieve(subscription.customer as string)) as Stripe.Customer;
      if (!customer) {
        return context.json({ error: 'Customer not found' }, 400);
      }
      const email = customer?.email as string;

      if (subscription.status === 'active') {
        const invoice = await stripe.invoices.retrieve(subscription.latest_invoice as string);
        const invoice_url = invoice.hosted_invoice_url as string;
        const data = await handleSubscription(subscription.id, invoice_url, email);
        if (data.error) {
          return context.json({ error: data.error }, 400);
        }
      }

      break;
    }
    case 'customer.subscription.deleted' || 'customer.subscription.paused': {
      const subscription = event.data.object.id as string;
      const user = await stripe.subscriptions.retrieve(subscription);

      const data = await handleRevokeSubscription(user.customer as Stripe.Customer);
      if (data.error) {
        return context.json({ error: data.error }, 400);
      }
      break;
    }
    default:
      break;
  }
  return context.json({ message: 'Received' }, 200);
});

stripe.openapi(listDonations, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);
  const { startDate, endDate, skip, take, all, search } = c.req.valid('query');
  const query = supabase.from('DONATIONS').select('*', { count: 'exact' }).order('created_at', { ascending: true });

  if (startDate) {
    query.gte('created_at', startDate);
  }

  if (endDate) {
    query.lte('created_at', endDate);
  }

  if (search) {
    const isNumber = !Number.isNaN(Number(search));
    if (isNumber) {
      query.eq('amount', Number(search));
    }
  }

  if (!all) {
    const { from, to } = getPagination(skip, take - 1);
    query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  const total = data.reduce((acc: number, curr: { amount: number }) => acc + curr.amount, 0);

  return c.json({ data, total, count: count || 0 }, 200);
});
