import { createRoute, z } from '@hono/zod-openapi';
import authMiddleware from '../middlewares/auth.js';
import { queryAllSchema } from '../utils/pagnination.js';
import { badRequestSchema, idParamValidator, notFoundSchema, serverErrorSchema } from '../validators/general.js';
import { messageResponseSchema, messageSchema, updateMessageSchema } from '../validators/messages.js';

export const getAllMessages = createRoute({
  method: 'get',
  path: '/messages',
  summary: 'Get all messages',
  description: 'Get all messages',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    query: queryAllSchema,
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: messageResponseSchema,
        },
      },
    },
    500: serverErrorSchema,
  },
  tags: ['message'],
});

export const createMessage = createRoute({
  method: 'post',
  path: '/messages',
  summary: 'Create a message',
  description: 'Create a message',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    body: {
      content: {
        'application/json': {
          schema: messageSchema.omit({ id: true, created_at: true, updated_at: true }),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: messageSchema,
        },
      },
    },
    400: badRequestSchema,
    500: serverErrorSchema,
  },
  tags: ['message'],
});

export const updateMessage = createRoute({
  method: 'patch',
  path: '/messages/{id}',
  summary: 'Update a message',
  description: 'Update a message',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: updateMessageSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: messageSchema,
        },
      },
    },
    400: badRequestSchema,
    404: notFoundSchema,
    500: serverErrorSchema,
  },
  tags: ['message'],
});

export const deleteMessage = createRoute({
  method: 'delete',
  path: '/messages/{id}',
  summary: 'Delete a message',
  description: 'Delete a message',
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
    404: notFoundSchema,
    500: serverErrorSchema,
  },
  tags: ['message'],
});
