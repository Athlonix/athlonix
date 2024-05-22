import { OpenAPIHono } from '@hono/zod-openapi';
import type { Context } from 'hono';
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

stripe.openapi(webhook, async (context: Context) => {
  const STRIPE_SECRET_API_KEY = process.env.STRIPE_SECRET_API_KEY as string;
  const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;
  const stripe = new Stripe(STRIPE_SECRET_API_KEY);
  const signature = context.req.header('stripe-signature');
  try {
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

      case 'customer.subscription.created': {
        const subscription = event.data.object.id as string;
        const invoice = await stripe.invoices.retrieve(event.data.object.latest_invoice as string);

        const data = await handleSubscription(subscription, invoice.invoice_pdf as string);
        if (data.error) {
          return context.json({ error: data.error }, 400);
        }
        break;
      }
      case 'customer.subscription.updated': {
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
  } catch (err) {
    const errorMessage = `⚠️  Webhook signature verification failed. ${
      err instanceof Error ? err.message : 'Internal server error'
    }`;
    return context.json({ error: errorMessage }, 500);
  }
});

stripe.openapi(listDonations, async (c) => {
  const user = c.get('user');
  const roles = user.roles;
  await checkRole(roles, false);
  const { startDate, endDate, skip, take, all, search } = c.req.valid('query');
  const query = supabase.from('DONATIONS').select('*').order('created_at', { ascending: true });

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

  const { data, error, count } = await query.range(skip, take);

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  const total = data.reduce((acc, curr) => acc + curr.amount, 0);

  return c.json({ data, total, count: count || 0 }, 200);
});
