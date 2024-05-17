import { createRoute, z } from '@hono/zod-openapi';
import authMiddleware from '../middlewares/auth.js';
import { queryAllSchema } from '../utils/pagnination.js';
import { badRequestSchema, idParamValidator, notFoundSchema, serverErrorSchema } from '../validators/general.js';

export const pollsSchema = z.object({
  id: z.number().positive(),
  title: z.string().max(50),
  description: z.string().max(255).nullable(),
  start_at: z.string().datetime(),
  end_at: z.string().datetime(),
  max_choices: z.number().min(1),
  id_user: z.number().positive(),
  results: z.array(z.object({ id: z.number().positive(), votes: z.number().positive(), content: z.string() })),
});

export const createPollSchema = z.object({
  title: z.string().max(50),
  description: z.string().max(255).nullable(),
  start_at: z.string().datetime(),
  end_at: z.string().datetime(),
  max_choices: z.number().min(1),
  options: z.array(z.object({ content: z.string() })),
});

export const pollsOptionSchema = z.object({
  id: z.number(),
  content: z.string(),
  id_poll: z.number(),
});

export const voteSchema = z.object({
  id: z.number(),
  options: z.array(z.number().min(1)),
  id_poll: z.number(),
});

export const createPoll = createRoute({
  method: 'post',
  path: '/polls',
  summary: 'Create a poll',
  description: 'Create a poll',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    body: {
      content: {
        'application/json': {
          schema: createPollSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: pollsSchema.omit({ results: true }),
        },
      },
    },
    400: badRequestSchema,
    500: serverErrorSchema,
  },
  tags: ['poll'],
});

export const getAllPolls = createRoute({
  method: 'get',
  path: '/polls',
  summary: 'Get all polls',
  description: 'Get all polls',
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
          schema: z.array(pollsSchema),
        },
      },
    },
    500: serverErrorSchema,
  },
  tags: ['poll'],
});

export const getOnePoll = createRoute({
  method: 'get',
  path: '/polls/{id}',
  summary: 'Get a poll',
  description: 'Get a poll',
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
          schema: pollsSchema,
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['poll'],
});

export const updatePoll = createRoute({
  method: 'patch',
  path: '/polls/{id}',
  summary: 'Update a poll',
  description: 'Update a poll if not started or expired',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: createPollSchema.omit({ options: true }).partial(),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: pollsSchema.omit({ results: true }),
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
    400: badRequestSchema,
  },

  tags: ['poll'],
});

export const deletePoll = createRoute({
  method: 'delete',
  path: '/polls/{id}',
  summary: 'Delete a poll',
  description: 'Delete a poll',
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
  tags: ['poll'],
});

export const voteToPoll = createRoute({
  method: 'post',
  path: '/polls/{id}/vote',
  summary: 'Vote to a poll',
  description: 'Vote to a poll if started and not expired',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: voteSchema.omit({ id: true, id_poll: true }),
        },
      },
    },
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
  tags: ['poll'],
});
