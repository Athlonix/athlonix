import { createRoute, z } from '@hono/zod-openapi';
import authMiddleware from '../middlewares/auth.js';
import { queryAllSchema } from '../utils/pagnination.js';
import { badRequestSchema, serverErrorSchema } from '../validators/general.js';

export const donationSchema = z.object({
  id: z.number().min(1),
  amount: z.number().positive(),
  receipt_url: z.string().url(),
  id_user: z.number().min(1).nullable(),
});

const query = queryAllSchema.extend({
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
});

export const webhook = createRoute({
  method: 'post',
  path: '/stripe/webhook',
  summary: 'Stripe webhook',
  description: 'Stripe webhook',
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    500: serverErrorSchema,
    400: badRequestSchema,
  },
  tags: ['stripe'],
});

export const listDonations = createRoute({
  method: 'get',
  path: '/stripe/donations',
  summary: 'List donations',
  description: 'List donations',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    query,
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: z.object({
            data: z.array(donationSchema),
            total: z.number().positive(),
            count: z.number().positive(),
          }),
        },
      },
    },
    400: badRequestSchema,
    500: serverErrorSchema,
  },
  tags: ['stripe'],
});
