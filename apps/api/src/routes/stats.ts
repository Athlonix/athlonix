import { createRoute, z } from '@hono/zod-openapi';
import authMiddleware from '../middlewares/auth.js';
import { serverErrorSchema } from '../validators/general.js';

const staticsSchema = z.object({
  totalMembers: z.number(),
  totalSports: z.number(),
  totalActivities: z.number(),
  totalTournaments: z.number(),
  membersByMonth: z.array(
    z.object({
      month: z.string(),
      members: z.number(),
    }),
  ),
  donations: z.array(
    z.object({
      month: z.string(),
      amount: z.number(),
    }),
  ),
});

export const getStatics = createRoute({
  method: 'get',
  path: '/stats',
  summary: 'Get all stats',
  description: 'Get all stats',
  middleware: authMiddleware,
  security: [{ Bearer: [] }],
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: staticsSchema,
        },
      },
    },
    500: serverErrorSchema,
  },
  tags: ['stats'],
});
