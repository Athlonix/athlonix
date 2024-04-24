import { createRoute, z } from '@hono/zod-openapi';
import authMiddleware from '../middlewares/auth.js';
import { paginationSchema } from '../utils/pagnination.js';
import { idParamValidator, notFoundSchema, serverErrorSchema } from '../validators/general.js';

export const sportSchema = z.object({
  id: z.number(),
  name: z.string().max(50),
  description: z.string().max(255),
  min_players: z.number().min(1),
  max_players: z.number().min(1).nullable(),
  image: z.string().nullable(),
});

export const getAllSports = createRoute({
  method: 'get',
  path: '/sports',
  summary: 'Get all sports',
  description: 'Get all sports',
  request: {
    query: paginationSchema,
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: {
            data: z.array(sportSchema),
          },
        },
      },
    },
    500: serverErrorSchema,
  },
  tags: ['sport'],
});

export const getOneSport = createRoute({
  method: 'get',
  path: '/sports/{id}',
  summary: 'Get a sport',
  description: 'Get a sport',
  request: {
    params: idParamValidator,
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: {
            data: sportSchema,
          },
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['sport'],
});

export const createSport = createRoute({
  method: 'post',
  path: '/sports',
  summary: 'Create a sport',
  description: 'Create a sport',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    body: {
      content: {
        'application/json': {
          schema: sportSchema.omit({ id: true }),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: {
            data: sportSchema,
          },
        },
      },
    },
    500: serverErrorSchema,
  },
  tags: ['sport'],
});

export const updateSport = createRoute({
  method: 'patch',
  path: '/sports/{id}',
  summary: 'Update a sport',
  description: 'Update a sport',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: sportSchema.omit({ id: true }).partial(),
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
            data: sportSchema,
          },
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['sport'],
});

export const deleteSport = createRoute({
  method: 'delete',
  path: '/sports/{id}',
  summary: 'Delete a sport',
  description: 'Delete a sport',
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
          schema: {
            data: sportSchema,
          },
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['sport'],
});
