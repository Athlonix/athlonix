import { createRoute, z } from '@hono/zod-openapi';
import authMiddleware from '../middlewares/auth.js';
import { queryAllSchema } from '../utils/pagnination.js';
import { badRequestSchema, idParamValidator, notFoundSchema, serverErrorSchema } from '../validators/general.js';

export const tournamentSchema = z.object({
  id: z.number(),
  default_match_length: z.number().min(1).nullable(),
  name: z.string().max(255),
  max_participants: z.number().min(1),
  team_capacity: z.number().min(1),
  rules: z.string().nullable(),
  prize: z.string().nullable(),
  id_address: z.number().min(1).nullable(),
  created_at: z.string().datetime(),
});

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
        'application/json': {
          schema: z.object({
            default_match_length: z.number().min(1).optional(),
            name: z.string().max(255),
            max_participants: z.number().min(1),
            team_capacity: z.number().min(1),
            rules: z.string().optional(),
            prize: z.string().optional(),
            id_address: z.number().min(1).optional(),
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
          schema: tournamentSchema,
        },
      },
    },
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
    query: queryAllSchema,
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
