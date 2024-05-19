import { OpenAPIHono } from '@hono/zod-openapi';
import type { Context } from 'hono';
import Stripe from 'stripe';
import { handleDonations } from '../libs/stripe.js';
import { zodErrorHook } from '../libs/zodError.js';
import { webhook } from '../routes/stripe.js';
import { checkRole } from '../utils/context.js';
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
        console.log(event.data.object);
        const email = event.data.object.receipt_email || 'test@email.com';
        const amount = event.data.object.amount / 100;
        const receipt_url = event.data.object.receipt_url as string;
        const data = await handleDonations(email, amount, receipt_url);
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
