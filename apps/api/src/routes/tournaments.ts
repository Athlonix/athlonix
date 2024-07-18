import { createRoute, z } from '@hono/zod-openapi';
import authMiddleware from '../middlewares/auth.js';
import { queryAllSchema } from '../utils/pagnination.js';
import { badRequestSchema, idParamValidator, notFoundSchema, serverErrorSchema } from '../validators/general.js';
import { createMatchSchema, createTournamentSchema, matchSchema, tournamentSchema } from '../validators/tournaments.js';

export const getAllTournaments = createRoute({
  method: 'get',
  path: '/tournaments',
  summary: 'Get all tournaments',
  description: 'Get all tournaments',
  request: {
    query: z.object({
      ...queryAllSchema.shape,
      id_sport: z.number().min(1).optional(),
      id_address: z.number().min(1).optional(),
    }),
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: z.object({
            data: z.array(tournamentSchema),
            count: z.number(),
          }),
        },
      },
    },
    500: serverErrorSchema,
    400: badRequestSchema,
  },
  tags: ['tournament'],
});

export const getTournamentById = createRoute({
  method: 'get',
  path: '/tournaments/{id}',
  summary: 'Get a tournament',
  description: 'Get a tournament',
  request: {
    params: idParamValidator,
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: tournamentSchema,
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['tournament'],
});

export const createTournament = createRoute({
  method: 'post',
  path: '/tournaments',
  summary: 'Create a tournament',
  description: 'Create a tournament',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: createTournamentSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: tournamentSchema,
        },
      },
    },
    400: badRequestSchema,
    500: serverErrorSchema,
  },
  tags: ['tournament'],
});

export const updateTournament = createRoute({
  method: 'patch',
  path: '/tournaments/{id}',
  summary: 'Update a tournament',
  description: 'Update a tournament',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: z.object({
            default_match_length: z.number().min(1).optional(),
            name: z.string().max(255).optional(),
            max_participants: z.number().min(1).optional(),
            team_capacity: z.number().min(1).optional(),
            rules: z.string().optional(),
            prize: z.string().optional(),
            id_address: z.number().min(1).optional(),
            description: z.string().optional(),
            id_sport: z.number().min(1).optional(),
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
          schema: tournamentSchema,
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['tournament'],
});

export const deleteTournament = createRoute({
  method: 'delete',
  path: '/tournaments/{id}',
  summary: 'Delete a tournament',
  description: 'Delete a tournament',
  security: [{ Bearer: [] }],
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
  tags: ['tournament'],
});

export const getTournamentTeams = createRoute({
  method: 'get',
  path: '/tournaments/{id}/teams',
  summary: 'Get all teams of a tournament',
  description: 'Get all teams of a tournament',
  request: {
    params: idParamValidator,
    query: z.object({
      ...queryAllSchema.shape,
      validate: z.boolean().optional(),
    }),
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: z.object({
            data: z.array(
              z.object({
                id: z.number(),
                name: z.string().max(255),
                created_at: z.string().datetime(),
                users: z.array(z.object({ id: z.number(), username: z.string().max(255) })),
              }),
            ),
            count: z.number(),
          }),
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['tournament'],
});

export const getTournamentTeamsById = createRoute({
  method: 'get',
  path: '/tournaments/{id}/teams/{id_team}',
  summary: 'Get a team of a tournament',
  description: 'Get a team of a tournament',
  request: {
    params: z.object({
      id: z.coerce.number(),
      id_team: z.coerce.number(),
    }),
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: z.object({
            id: z.number(),
            name: z.string().max(255),
            created_at: z.string().datetime(),
            users: z.array(z.object({ id: z.number(), username: z.string().max(255) })),
          }),
        },
      },
    },
    404: notFoundSchema,
    500: serverErrorSchema,
  },
  tags: ['tournament'],
});

export const createTeams = createRoute({
  method: 'post',
  path: '/tournaments/{id}/teams',
  summary: 'Create a team for a tournament',
  description: 'Create a team for a tournament',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: z.object({
            name: z.string().max(255),
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
            id: z.number(),
            name: z.string().max(255),
            created_at: z.string().datetime(),
            users: z.array(z.object({ id: z.number(), username: z.string().max(255) })),
          }),
        },
      },
    },
    500: serverErrorSchema,
    400: badRequestSchema,
  },
  tags: ['tournament'],
});

export const updateTeam = createRoute({
  method: 'patch',
  path: '/tournaments/{id}/teams/{id_team}',
  summary: 'Update a team of a tournament',
  description: 'Update a team of a tournament',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: z.object({
      id: z.coerce.number(),
      id_team: z.coerce.number(),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            name: z.string().max(255).optional(),
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
            id: z.number(),
            name: z.string().max(255),
            created_at: z.string().datetime(),
          }),
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['tournament'],
});

export const deleteTeam = createRoute({
  method: 'delete',
  path: '/tournaments/{id}/teams/{id_team}',
  summary: 'Delete a team of a tournament',
  description: 'Delete a team of a tournament',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: z.object({
      id: z.coerce.number(),
      id_team: z.coerce.number(),
    }),
  },
  responses: {
    200: {
      description: 'Successful response',
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['tournament'],
});

export const joinTeam = createRoute({
  method: 'post',
  path: '/tournaments/{id}/teams/{id_team}/join',
  summary: 'Join a team of a tournament',
  description: 'Join a team of a tournament',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: z.object({
      id: z.coerce.number(),
      id_team: z.coerce.number(),
    }),
  },
  responses: {
    200: {
      description: 'Successful response',
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['tournament'],
});

export const leaveTeam = createRoute({
  method: 'delete',
  path: '/tournaments/{id}/teams/{id_team}/leave',
  summary: 'Leave a team of a tournament',
  description: 'Leave a team of a tournament',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: z.object({
      id: z.coerce.number(),
      id_team: z.coerce.number(),
    }),
  },
  responses: {
    200: {
      description: 'Successful response',
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['tournament'],
});

export const validateTeam = createRoute({
  method: 'patch',
  path: '/tournaments/{id}/teams/{id_team}/validate',
  summary: 'Validate a team of a tournament',
  description: 'Validate a team of a tournament',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: z.object({
      id: z.coerce.number(),
      id_team: z.coerce.number(),
    }),
  },
  responses: {
    200: {
      description: 'Successful response',
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['tournament'],
});

export const cancelTeam = createRoute({
  method: 'patch',
  path: '/tournaments/{id}/teams/{id_team}/cancel',
  summary: 'Cancel a team of a tournament',
  description: 'Cancel a team of a tournament',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: z.object({
      id: z.coerce.number(),
      id_team: z.coerce.number(),
    }),
  },
  responses: {
    200: {
      description: 'Successful response',
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['tournament'],
});

export const getRounds = createRoute({
  method: 'get',
  path: '/tournaments/{id}/rounds',
  summary: 'Get all rounds of a tournament',
  description: 'Get all rounds of a tournament',
  request: {
    params: idParamValidator,
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: z.object({
            data: z.array(
              z.object({
                id: z.number(),
                name: z.string().max(255),
                id_tournament: z.number(),
                order: z.number(),
              }),
            ),
            count: z.number(),
          }),
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['tournament'],
});

export const getRoundById = createRoute({
  method: 'get',
  path: '/tournaments/{id}/rounds/{id_round}',
  summary: 'Get a round of a tournament',
  description: 'Get a round of a tournament',
  request: {
    params: z.object({
      id: z.coerce.number(),
      id_round: z.coerce.number(),
    }),
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: z.object({
            id: z.number(),
            name: z.string().max(255),
            id_tournament: z.number(),
            order: z.number(),
          }),
        },
      },
    },
    404: notFoundSchema,
    500: serverErrorSchema,
  },
  tags: ['tournament'],
});

export const createRound = createRoute({
  method: 'post',
  path: '/tournaments/{id}/rounds',
  summary: 'Create a round for a tournament',
  description: 'Create a round for a tournament',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: z.object({
            name: z.string().max(255),
            order: z.number(),
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
            id: z.number(),
            name: z.string().max(255),
            id_tournament: z.number(),
            order: z.number(),
          }),
        },
      },
    },
    500: serverErrorSchema,
    400: badRequestSchema,
  },
  tags: ['tournament'],
});

export const updateRound = createRoute({
  method: 'patch',
  path: '/tournaments/{id}/rounds/{id_round}',
  summary: 'Update a round of a tournament',
  description: 'Update a round of a tournament',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: z.object({
      id: z.coerce.number(),
      id_round: z.coerce.number(),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            name: z.string().max(255).optional(),
            order: z.number().optional(),
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
            id: z.number(),
            name: z.string().max(255),
            id_tournament: z.number(),
            order: z.number(),
          }),
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['tournament'],
});

export const deleteRound = createRoute({
  method: 'delete',
  path: '/tournaments/{id}/rounds/{id_round}',
  summary: 'Delete a round of a tournament',
  description: 'Delete a round of a tournament',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: z.object({
      id: z.coerce.number(),
      id_round: z.coerce.number(),
    }),
  },
  responses: {
    200: {
      description: 'Successful response',
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['tournament'],
});

export const getAllMatches = createRoute({
  method: 'get',
  path: '/tournaments/{id_tournament}/rounds/{id_round}/matches',
  summary: 'Get all matches',
  description: 'Get all matches',
  request: {
    params: z.object({
      id_tournament: z.coerce.number().min(1),
      id_round: z.coerce.number().min(1),
    }),
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: z.object({
            data: z.array(matchSchema),
            count: z.number(),
          }),
        },
      },
    },
    500: serverErrorSchema,
  },
  tags: ['tournament'],
});

export const getMatchById = createRoute({
  method: 'get',
  path: '/tournaments/{id_tournament}/rounds/{id_round}/matches/{id}',
  summary: 'Get a match',
  description: 'Get a match',
  request: {
    params: z.object({
      id_tournament: z.coerce.number(),
      id_round: z.coerce.number(),
      id: z.coerce.number(),
    }),
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
  },
  tags: ['tournament'],
});

export const createMatch = createRoute({
  method: 'post',
  path: '/tournaments/{id_tournament}/rounds/{id_round}/matches',
  summary: 'Create a match',
  description: 'Create a match',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: z.object({
      id_tournament: z.coerce.number(),
      id_round: z.coerce.number(),
    }),
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
  tags: ['tournament'],
});

export const updateMatch = createRoute({
  method: 'put',
  path: '/tournaments/{id_tournament}/rounds/{id_round}/matches/{id}',
  summary: 'Update a match',
  description: 'Update a match',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: z.object({
      id_tournament: z.coerce.number(),
      id_round: z.coerce.number(),
      id: z.coerce.number(),
    }),
    body: {
      content: {
        'application/json': {
          schema: createMatchSchema,
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
  tags: ['tournament'],
});

export const deleteMatch = createRoute({
  method: 'delete',
  path: '/tournaments/{id_tournament}/rounds/{id_round}/matches/{id}',
  summary: 'Delete a match',
  description: 'Delete a match',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: z.object({
      id_tournament: z.coerce.number(),
      id_round: z.coerce.number(),
      id: z.coerce.number(),
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
  tags: ['tournament'],
});
