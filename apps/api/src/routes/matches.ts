import { createRoute, z } from '@hono/zod-openapi';
import authMiddleware from '../middlewares/auth.js';
import { queryAllSchema } from '../utils/pagnination.js';
import { idParamValidator, notFoundSchema, serverErrorSchema } from '../validators/general.js';

export const getAllMatches = createRoute({
  method: 'get',
  path: '/matches',
  summary: 'Get all matches',
  description: 'Get all matches',
  request: {
    query: queryAllSchema,
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: {
            data: z.array(
              z.object({
                id: z.number(),
                start_time: z.string().datetime(),
                end_time: z.string().datetime(),
                winner: z.array(z.boolean().nullable()),
              }),
            ),
          },
        },
      },
    },
    500: serverErrorSchema,
  },
  tags: ['match'],
});

export const getMatchById = createRoute({
  method: 'get',
  path: '/matches/{id}',
  summary: 'Get a match',
  description: 'Get a match',
  request: {
    params: idParamValidator,
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: {
            data: z.object({
              id: z.number(),
              start_time: z.string().datetime(),
              end_time: z.string().datetime(),
              winner: z.array(z.boolean().nullable()),
            }),
          },
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['match'],
});

export const createMatch = createRoute({
  method: 'post',
  path: '/matches',
  summary: 'Create a match',
  description: 'Create a match',
  middleware: authMiddleware,
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            start_time: z.string().datetime(),
            end_time: z.string().datetime(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Successful response',
    },
    500: serverErrorSchema,
  },
  tags: ['match'],
});

export const createMatchTournament = createRoute({
  method: 'post',
  path: '/matches/tournament/{id_tournament}',
  summary: 'Create a match for a tournament',
  description: 'Create a match for a tournament',
  middleware: authMiddleware,
  request: {
    params: z.object({
      id_tournament: z.number().min(1),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            round: z.number().min(1),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Successful response',
    },
    500: serverErrorSchema,
  },
  tags: ['match'],
});

export const updateMatch = createRoute({
  method: 'put',
  path: '/matches/{id}',
  summary: 'Update a match',
  description: 'Update a match',
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: z.object({
            start_time: z.string().datetime(),
            end_time: z.string().datetime(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Successful response',
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['match'],
});

export const updateMatchWinner = createRoute({
  method: 'patch',
  path: '/matches/{id}/winner',
  summary: 'Update the winner of a match',
  description: 'Update the winner of a match',
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    query: z.object({
      idTeam: z.number().min(1),
      winner: z.boolean(),
    }),
  },
  responses: {
    200: {
      description: 'Successful response',
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['match'],
});

export const deleteMatch = createRoute({
  method: 'delete',
  path: '/matches/{id}',
  summary: 'Delete a match',
  description: 'Delete a match',
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
  },
  responses: {
    200: {
      description: 'Successful response',
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['match'],
});
