import { createRoute, z } from '@hono/zod-openapi';
import authMiddleware from '../middlewares/auth.js';
import { paginationSchema } from '../utils/pagnination.js';
import { idParamValidator, notFoundSchema, serverErrorSchema } from '../validators/general.js';

export const activitySchema = z.object({
  id: z.coerce.number(),
  name: z.string().max(50),
  description: z.string().max(255).nullable(),
  max_participants: z.coerce.number().min(1),
  min_participants: z.coerce.number().min(1),
  days: z.array(z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])),
  recurrence: z.enum(['weekly', 'monthly', 'annual']),
  interval: z.coerce.number().min(1),
  start_date: z.string(),
  end_date: z.string(),
  id_sport: z.coerce.number().nullable(),
  id_address: z.coerce.number().nullable(),
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
          schema: activitySchema.omit({ id: true }).partial(),
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

export const applyToActivity = createRoute({
  method: 'post',
  path: '/activities/{id}/apply',
  summary: 'Apply to a activity',
  description: 'Apply to a activity',
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

export const cancelApplication = createRoute({
  method: 'delete',
  path: '/activities/{id}/apply',
  summary: 'Cancel application to a activity',
  description: 'Cancel application to a activity',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: z.object({
            id_user: z.coerce.number().min(1),
          }),
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

export const validApplication = createRoute({
  method: 'post',
  path: '/activities/{id}/validApply',
  summary: 'Valid application to a activity',
  description: 'Valid application to a activity',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: z.object({
            id_user: z.coerce.number().min(1),
          }),
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
