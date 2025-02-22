import { createRoute, z } from '@hono/zod-openapi';
import authMiddleware from '../middlewares/auth.js';
import { badRequestSchema, idParamValidator, notFoundSchema, serverErrorSchema } from '../validators/general.js';

export const getReasons = createRoute({
  method: 'get',
  path: '/reasons',
  summary: 'Get all reasons',
  description: 'Get all reasons',
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: z.array(
            z.object({
              id: z.number().min(1),
              reason: z.string().min(5).max(255),
            }),
          ),
        },
      },
    },
    500: serverErrorSchema,
  },
  tags: ['reason'],
});

export const getReasonById = createRoute({
  method: 'get',
  path: '/reasons/{id}',
  summary: 'Get a reason',
  description: 'Get a reason',
  request: {
    params: idParamValidator,
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: z.object({
            id: z.number().min(1),
            reason: z.string().min(5).max(255),
          }),
        },
      },
    },
    404: notFoundSchema,
    500: serverErrorSchema,
  },
  tags: ['reason'],
});

export const createReason = createRoute({
  method: 'post',
  path: '/reasons',
  summary: 'Create a reason',
  description: 'Create a reason',
  security: [{ Bearer: [] }],
  middleware: [authMiddleware],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            reason: z.string().min(5).max(255),
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
            id: z.number().min(1),
            reason: z.string().min(5).max(255),
          }),
        },
      },
    },
    400: badRequestSchema,
    500: serverErrorSchema,
  },
  tags: ['reason'],
});

export const updateReason = createRoute({
  method: 'patch',
  path: '/reasons/{id}',
  summary: 'Update a reason',
  description: 'Update a reason',
  security: [{ Bearer: [] }],
  middleware: [authMiddleware],
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: z.object({
            reason: z.string().min(5).max(255),
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
            id: z.number().min(1),
            reason: z.string().min(5).max(255),
          }),
        },
      },
    },
    404: notFoundSchema,
    400: badRequestSchema,
    500: serverErrorSchema,
  },
  tags: ['reason'],
});

export const deleteReason = createRoute({
  method: 'delete',
  path: '/reasons/{id}',
  summary: 'Delete a reason',
  description: 'Delete a reason',
  security: [{ Bearer: [] }],
  middleware: [authMiddleware],
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
    404: notFoundSchema,
    500: serverErrorSchema,
  },
  tags: ['reason'],
});
