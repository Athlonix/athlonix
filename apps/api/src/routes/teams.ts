import { createRoute, z } from '@hono/zod-openapi';
import authMiddleware from '../middlewares/auth.js';
import { badRequestSchema, notFoundSchema, serverErrorSchema } from '../validators/general.js';
import { activityMemberParamSchema, activityTeamSchema } from '../validators/teams.js';

export const getOneActivityTeam = createRoute({
  method: 'get',
  path: '/activities/{id_activity}/team',
  summary: 'Get an activity team',
  description: 'Get an activity team',
  request: {
    params: z.object({
      id_activity: z.coerce.number().min(1),
    }),
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: activityTeamSchema,
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['activity_team'],
});

export const addActivityMember = createRoute({
  method: 'post',
  path: '/activities/{id_activity}/team/{id_user}',
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
    404: notFoundSchema,
  },
  tags: ['activity_team'],
});

export const removeActivityMember = createRoute({
  method: 'delete',
  path: '/activities/{id_activity}/team/{id_user}',
  summary: 'Delete an user from an activity team',
  description: 'Delete an user from an activity team',
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
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    500: serverErrorSchema,
    400: badRequestSchema,
    404: notFoundSchema,
  },
  tags: ['activity_team'],
});
