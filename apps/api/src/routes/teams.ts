import { createRoute, z } from '@hono/zod-openapi';
import authMiddleware from '../middlewares/auth.js';
import { badRequestSchema, serverErrorSchema } from '../validators/general.js';
import { activityMemberParamSchema, activityMemberSchema } from '../validators/teams.js';

export const addActivityMember = createRoute({
  method: 'post',
  path: '/activities/{id_activity}/team/{id_member}',
  summary: 'Add a user to an activity team',
  description: 'Add a user to an activity team',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: activityMemberParamSchema,
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: activityMemberParamSchema,
        },
      },
    },
    500: serverErrorSchema,
    400: badRequestSchema,
  },
  tags: ['activity_team'],
});
