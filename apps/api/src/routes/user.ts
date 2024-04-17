import { createRoute, z } from '@hono/zod-openapi';
import authMiddleware from '../middlewares/auth';
import { paginationSchema } from '../utils/pagnination';
import { userSchema } from '../validators/auth';
import { idParamValidator, notFoundSchema, serverErrorSchema } from '../validators/general';

export const getAllUsers = createRoute({
  method: 'get',
  path: '/users',
  summary: 'Get all users',
  description: 'Get all users',
  middleware: authMiddleware,
  request: {
    query: paginationSchema,
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: {
            data: userSchema,
          },
        },
      },
    },
    500: serverErrorSchema,
  },
  tags: ['user'],
});

export const getOneUser = createRoute({
  method: 'get',
  path: '/users/{id}',
  summary: 'Get a user',
  description: 'Get a user',
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
            data: userSchema,
          },
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['user'],
});

export const updateUser = createRoute({
  method: 'patch',
  path: '/users/{id}',
  summary: 'Update a user',
  description: 'Update a user',
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: userSchema,
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
            data: userSchema,
          },
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['user'],
});

export const deleteUser = createRoute({
  method: 'delete',
  path: '/users/{id}',
  summary: 'Delete a user',
  description: 'Delete a user',
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
            data: userSchema,
          },
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['user'],
});

export const changeUserRole = createRoute({
  method: 'patch',
  path: '/users/{id}/role',
  summary: 'Change user role',
  description: 'Change user role',
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: z.object({
            id_role: z.coerce.number().min(1),
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
            data: userSchema,
          },
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['user'],
});
