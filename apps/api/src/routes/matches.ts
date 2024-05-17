import { createRoute, z } from '@hono/zod-openapi';
import authMiddleware from '../middlewares/auth.js';
import { queryAllSchema } from '../utils/pagnination.js';
import { badRequestSchema, idParamValidator, notFoundSchema, serverErrorSchema } from '../validators/general.js';

export const getAllMatchesSchema = z.object({
  id: z.number().min(0),
  start_time: z.string().datetime().nullable(),
  end_time: z.string().datetime().nullable(),
  winner: z
    .object({
      winner: z.boolean().nullable(),
      id_team: z.number(),
    })
    .array(),
});

export const matchSchema = z.object({
  id: z.number().min(0),
  start_time: z.string().datetime().nullable(),
  end_time: z.string().datetime().nullable(),
});

export const createMatchSchema = z.object({
  start_time: z.string().datetime().nullable(),
  end_time: z.string().datetime().nullable(),
});

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
          schema: z.object({
            data: z.array(getAllMatchesSchema),
            count: z.number(),
          }),
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
          schema: getAllMatchesSchema,
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
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    body: {
      content: {
        'application/json': {
          schema: createMatchSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: matchSchema,
        },
      },
    },
    500: serverErrorSchema,
    400: badRequestSchema,
  },
  tags: ['match'],
});

export const createMatchTournament = createRoute({
  method: 'post',
  path: '/matches/{id}/tournaments/{id_tournament}',
  summary: 'Create a match for a tournament',
  description: 'Create a match for a tournament',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: z.object({
      id: z.coerce.number().min(1),
      id_tournament: z.coerce.number().min(1),
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
  security: [{ Bearer: [] }],
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
      content: {
        'application/json': {
          schema: matchSchema,
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
    400: badRequestSchema,
  },
  tags: ['match'],
});

export const updateMatchWinner = createRoute({
  method: 'patch',
  path: '/matches/{id}/winner',
  summary: 'Update the winner of a match',
  description: 'Update the winner of a match',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    query: z.object({
      idTeam: z.coerce.number().min(1),
      winner: z.coerce.boolean(),
    }),
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
  tags: ['match'],
});

export const deleteMatchTournament = createRoute({
  method: 'delete',
  path: '/matches/{id}/tournaments/{id_tournament}',
  summary: 'Delete a match from a tournament',
  description: 'Delete a match from a tournament',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: z.object({
      id: z.coerce.number().min(1),
      id_tournament: z.coerce.number().min(1),
    }),
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
  tags: ['match'],
});

export const deleteMatch = createRoute({
  method: 'delete',
  path: '/matches/{id}',
  summary: 'Delete a match',
  description: 'Delete a match',
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
  tags: ['match'],
});
