import { createRoute, z } from '@hono/zod-openapi';
import authMiddleware from '../middlewares/auth.js';
import { queryAllSchema } from '../utils/pagnination.js';
import { activitySchema, activitySchemaReponse } from '../validators/activities.js';
import { idParamValidator, notFoundSchema, serverErrorSchema } from '../validators/general.js';

export const getAllActivities = createRoute({
  method: 'get',
  path: '/activities',
  summary: 'Get all activities',
  description: 'Get all activities',
  request: {
    query: queryAllSchema,
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: {
            data: z.object({
              data: z.array(activitySchemaReponse),
              count: z.number(),
            }),
          },
        },
      },
    },
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
            data: activitySchemaReponse,
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
          schema: activitySchema,
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
          schema: z.object({ message: z.string() }),
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
          schema: z.object({ message: z.string() }),
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
          schema: z.object({ message: z.string() }),
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
          schema: z.object({ message: z.string() }),
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['activity'],
});
