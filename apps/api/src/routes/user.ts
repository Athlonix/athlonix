import { createRoute, z } from '@hono/zod-openapi';
import authMiddleware from '../middlewares/auth.js';
import { paginationSchema } from '../utils/pagnination.js';
import { userSchema } from '../validators/auth.js';
import { idParamValidator, notFoundSchema, serverErrorSchema } from '../validators/general.js';

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

export const addUserRole = createRoute({
  method: 'post',
  path: '/users/{id}/roles',
  summary: 'Add a role to a user',
  description: 'Add a role to a user',
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: z.object({
            id_role: z.number().min(1),
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

export const removeUserRole = createRoute({
  method: 'delete',
  path: '/users/{id}/roles',
  summary: 'Remove a role from a user',
  description: 'Remove a role from a user',
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: z.object({
            id_role: z.number().min(1),
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
