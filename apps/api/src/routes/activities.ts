import { createRoute, z } from '@hono/zod-openapi';
import authMiddleware from '../middlewares/auth.js';
import { queryAllSchema } from '../utils/pagnination.js';
import {
  activityExceptionSchema,
  activityOccurencesSchema,
  activitySchema,
  activitySchemaReponse,
  queryActivitiesExceptionSchema,
} from '../validators/activities.js';
import { badRequestSchema, idParamValidator, notFoundSchema, serverErrorSchema } from '../validators/general.js';

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
          schema: z.object({
            data: z.array(activitySchemaReponse),
            count: z.number(),
          }),
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
          schema: activitySchemaReponse,
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['activity'],
});

export const getUsersActivity = createRoute({
  method: 'get',
  path: '/activities/{id}/users',
  summary: 'Get all users of an activity',
  description: 'Get all users of an activity',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: z.object({
      id: z.coerce.number().min(1),
    }),
    query: z.object({
      date: z.string().date(),
    }),
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: z.object({
            data: z.array(z.object({ id: z.number(), username: z.string(), active: z.boolean() })),
            count: z.number(),
          }),
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['activity'],
});

export const getOneActivityOccurences = createRoute({
  method: 'get',
  path: '/activities/{id}/occurences',
  summary: 'Get all occurences of an activity',
  description: 'Get all occurences of an activity',
  request: {
    query: queryActivitiesExceptionSchema.omit({ all: true }),
    params: idParamValidator,
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: activityOccurencesSchema,
        },
      },
    },
    500: serverErrorSchema,
    400: badRequestSchema,
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
    400: badRequestSchema,
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
          schema: activitySchema,
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
    400: badRequestSchema,
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
    params: z.object({
      ...idParamValidator.shape,
      date: z.string().date(),
    }),
  },
  responses: {
    201: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: z.object({ message: z.string() }),
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
    400: badRequestSchema,
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
    400: badRequestSchema,
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
    400: badRequestSchema,
  },
  tags: ['activity'],
});

export const createActivityException = createRoute({
  method: 'post',
  path: '/activities/{id}/exceptions',
  summary: 'Create an activity exception',
  description: 'Create an activity exception',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    body: {
      content: {
        'application/json': {
          schema: activityExceptionSchema.omit({ id: true, id_activity: true }),
        },
      },
    },
    params: z.object({ id: z.coerce.number().min(1) }),
  },
  responses: {
    201: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: activityExceptionSchema,
        },
      },
    },
    404: notFoundSchema,
    400: badRequestSchema,
    500: serverErrorSchema,
  },
  tags: ['activity'],
});

export const deleteActivityExceptions = createRoute({
  method: 'delete',
  path: '/activities_exceptions/{id}',
  summary: 'Delete an activity exception',
  description: 'Delete an activity exception',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: z.object({ id: z.coerce.number().min(1) }),
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

export const getAllActivitiesExceptions = createRoute({
  method: 'get',
  path: '/activities/{id}/exceptions',
  summary: 'Get all activities exceptions',
  description: 'Get all activities exceptions',
  request: {
    params: z.object({ id: z.coerce.number().min(1) }),
    query: queryActivitiesExceptionSchema.omit({ all: true }),
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: z.object({
            data: z.array(activityExceptionSchema),
            count: z.number(),
          }),
        },
      },
    },
    500: serverErrorSchema,
  },
  tags: ['activity'],
});
