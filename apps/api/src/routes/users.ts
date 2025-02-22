import { createRoute, z } from '@hono/zod-openapi';
import { RoleEnum, hierarchySchema } from '../libs/hiearchy.js';
import authMiddleware from '../middlewares/auth.js';
import { queryAllSchema, queryAllUsersSchema } from '../utils/pagnination.js';
import { userActivities } from '../validators/activities.js';
import { updateUserSchema, userSchema } from '../validators/auth.js';
import { badRequestSchema, idParamValidator, notFoundSchema, serverErrorSchema } from '../validators/general.js';

export const getAllUsers = createRoute({
  method: 'get',
  path: '/users',
  summary: 'Get all users',
  description: 'Get all users',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    query: queryAllUsersSchema,
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: z.object({
            data: z.array(userSchema),
            count: z.number(),
          }),
        },
      },
    },
    404: notFoundSchema,
    500: serverErrorSchema,
  },
  tags: ['user'],
});

export const getOneUser = createRoute({
  method: 'get',
  path: '/users/{id}',
  summary: 'Get a user',
  description: 'Get a user',
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
          schema: userSchema,
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['user'],
});

export const getMe = createRoute({
  method: 'get',
  path: '/users/me',
  summary: 'Get my informations',
  description: 'Get my informations',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: userSchema,
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['user'],
});

export const getHierarchy = createRoute({
  method: 'get',
  path: '/users/hierarchy',
  summary: 'Get the hierarchy of the association',
  description: 'Get the hierarchy of the association',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: hierarchySchema.openapi({
            type: 'object',
            properties: {
              role: { type: 'string', enum: RoleEnum.options },
              name: { type: 'string' },
              children: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/HierarchySchema',
                },
              },
            },
          }),
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
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: updateUserSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: userSchema,
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
    400: badRequestSchema,
    403: {
      description: 'Forbidden',
      content: {
        'application/json': {
          schema: z.object({
            error: z.string(),
          }),
        },
      },
    },
  },
  tags: ['user'],
});

export const deleteUser = createRoute({
  method: 'delete',
  path: '/users/{id}',
  summary: 'Delete a user',
  description: 'Delete a user',
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
          schema: z.object({
            message: z.string(),
          }),
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
  security: [{ Bearer: [] }],
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
    201: {
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
    404: notFoundSchema,
    400: badRequestSchema,
  },
  tags: ['user'],
});

export const removeUserRole = createRoute({
  method: 'delete',
  path: '/users/{id}/roles',
  summary: 'Remove a role from a user',
  description: 'Remove a role from a user',
  security: [{ Bearer: [] }],
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
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
    400: badRequestSchema,
  },
  tags: ['user'],
});

export const updateUserRole = createRoute({
  method: 'put',
  path: '/users/{id}/roles',
  summary: 'Update a user roles',
  description: 'Update a user roles',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: z.object({
            roles: z.array(z.number()).nullable(),
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
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
    400: badRequestSchema,
  },
  tags: ['user'],
});

export const softDeleteUser = createRoute({
  method: 'delete',
  path: '/users/{id}/soft',
  summary: 'Soft delete a user',
  description: 'Soft delete a user',
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
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
    400: badRequestSchema,
  },
  tags: ['user'],
});

export const getUsersActivities = createRoute({
  method: 'get',
  path: '/users/{id}/activities',
  summary: 'Get all activities of a user',
  description: 'Get all activities of a user',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    query: queryAllSchema,
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: z.object({
            data: z.array(userActivities),
            count: z.number(),
          }),
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
    400: badRequestSchema,
  },
  tags: ['user'],
});

export const setStatus = createRoute({
  method: 'patch',
  path: '/users/{id}/status',
  summary: 'Set a subscription status to a user',
  description: 'Set a subscription status to a user',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: z.object({
            status: z.enum(['applied', 'approved', 'rejected']),
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
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
    400: badRequestSchema,
  },
  tags: ['user'],
});

export const subscribeNewsletter = createRoute({
  method: 'post',
  path: '/users/newsletter',
  summary: 'Subscribe to the newsletter',
  description: 'Subscribe to the newsletter',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            email: z.string().email(),
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
  tags: ['user'],
});

export const getUserInvoice = createRoute({
  method: 'get',
  path: '/users/invoice',
  summary: 'Return your last invoice',
  description: 'Return your last invoice',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: z.object({
            invoice: z.string().nullable(),
          }),
        },
      },
    },
    400: badRequestSchema,
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['user'],
});
