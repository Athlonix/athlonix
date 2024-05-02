import { createRoute, z } from '@hono/zod-openapi';
import authMiddleware from '../middlewares/auth.js';
import { paginationSchema } from '../utils/pagnination.js';
import { idParamValidator, notFoundSchema, serverErrorSchema } from '../validators/general.js';

export const addressSchema = z.object({
  id: z.number(),
  road: z.string(),
  postal_code: z.string(),
  complement: z.string().nullable(),
  city: z.string(),
  number: z.number(),
  name: z.string().nullable(),
  id_lease: z.number().nullable(),
});

export const createAddress = createRoute({
  method: 'post',
  path: '/addresses',
  summary: 'Create a address',
  description: 'Create a address',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    body: {
      content: {
        'application/json': {
          schema: addressSchema.omit({ id: true }),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: { type: 'string' },
        },
      },
    },
    500: serverErrorSchema,
  },
  tags: ['location'],
});

export const getAllAddresses = createRoute({
  method: 'get',
  path: '/addresses',
  summary: 'Get all addresses',
  description: 'Get all addresses',
  request: {
    query: z.object({
      search: z.string().optional(),
      ...paginationSchema.shape,
    }),
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: {
            data: addressSchema,
          },
        },
      },
    },
    500: serverErrorSchema,
  },
  tags: ['location'],
});

export const getOneAddress = createRoute({
  method: 'get',
  path: '/addresses/{id}',
  summary: 'Get a address',
  description: 'Get a address',
  request: {
    params: idParamValidator,
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: {
            data: addressSchema,
          },
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['location'],
});

export const updateAddress = createRoute({
  method: 'patch',
  path: '/addresses/{id}',
  summary: 'Update a address',
  description: 'Update a address',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: addressSchema.omit({ id: true }).partial(),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: { type: 'string' },
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['location'],
});

export const deleteAddress = createRoute({
  method: 'delete',
  path: '/addresses/{id}',
  summary: 'Delete a address',
  description: 'Delete a address',
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
          schema: { type: 'string' },
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['location'],
});
