import { createRoute, z } from '@hono/zod-openapi';
import authMiddleware from '../middlewares/auth.js';
import { paginationSchema } from '../utils/pagnination.js';
import { idParamValidator, notFoundSchema, serverErrorSchema } from '../validators/general.js';

export const activitySchema = z.object({
  id: z.number(),
  max_participants: z.number().min(1),
  name: z.string(),
  duration_minute: z.number().min(1),
  id_sport: z.number().nullable(),
  id_address: z.number().nullable(),
});

export const getAllActivities = createRoute({
  method: 'get',
  path: '/activities',
  summary: 'Get all activities',
  description: 'Get all activities',
  request: {
    query: paginationSchema,
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: {
            data: z.array(activitySchema),
          },
        },
      },
    },
    500: serverErrorSchema,
  },
  tags: ['activity'],
});

export const getOneActivity = createRoute({
  method: 'get',
  path: '/activities/{id}',
  summary: 'Get a activity',
  description: 'Get a activity',
  request: {
    params: idParamValidator,
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: {
            data: activitySchema,
          },
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['activity'],
});

export const createActivity = createRoute({
  method: 'post',
  path: '/activities',
  summary: 'Create a activity',
  description: 'Create a activity',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    body: {
      content: {
        'application/json': {
          schema: activitySchema.omit({ id: true }),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: {
            data: activitySchema,
          },
        },
      },
    },
    500: serverErrorSchema,
  },
  tags: ['activity'],
});

export const updateActivity = createRoute({
  method: 'patch',
  path: '/activities/{id}',
  summary: 'Update a activity',
  description: 'Update a activity',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: activitySchema.omit({ id: true }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: {
            data: activitySchema,
          },
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['activity'],
});

export const deleteActivity = createRoute({
  method: 'delete',
  path: '/activities/{id}',
  summary: 'Delete a activity',
  description: 'Delete a activity',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: {
            data: activitySchema,
          },
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['activity'],
});
