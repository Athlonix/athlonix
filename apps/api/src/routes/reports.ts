import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import authMiddleware from '../middlewares/auth.js';
import { queryAllSchema } from '../utils/pagnination.js';
import { badRequestSchema, notFoundSchema, serverErrorSchema } from '../validators/general.js';

export const getReports = createRoute({
  method: 'get',
  path: '/reports/posts/{id_post}',
  summary: 'Get all reports',
  description: 'Get all reports',
  request: {
    params: z.object({
      id_post: z.coerce.number(),
    }),
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
                id: z.number().min(1),
                created_at: z.string().datetime(),
                id_reason: z.number().min(1),
                content: z.string().max(255),
                id_post: z.number().min(1).nullable(),
                id_comment: z.number().min(1).nullable(),
              }),
            ),
          },
        },
      },
    },
    500: serverErrorSchema,
  },
  tags: ['blog'],
});

export const createReport = createRoute({
  method: 'post',
  path: '/reports/posts/{id_post}',
  summary: 'Create a report',
  description: 'Create a report',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: z.object({
      id_post: z.coerce.number(),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            id_reason: z.number().min(1),
            content: z.string().max(255),
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
            id: z.number().min(1),
            created_at: z.string().datetime(),
            id_reason: z.number().min(1),
            content: z.string().max(255),
            id_post: z.number().min(1).nullable(),
            id_comment: z.number().min(1).nullable(),
          }),
        },
      },
    },
    400: badRequestSchema,
    500: serverErrorSchema,
  },
  tags: ['blog'],
});

export const deleteReport = createRoute({
  method: 'delete',
  path: '/reports/{id}',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  summary: 'Delete a report',
  description: 'Delete a report',
  request: {
    params: z.object({
      id: z.coerce.number(),
    }),
  },
  responses: {
    200: {
      description: 'Successful response',
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['blog'],
});

export const getReportComments = createRoute({
  method: 'get',
  path: '/comments/{id_comment}/reports',
  summary: 'Get comments and responses on a report',
  description: 'Get comments and responses on a report',
  request: {
    params: z.object({
      id_comment: z.coerce.number(),
    }),
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
                id: z.number().min(1),
                created_at: z.string().datetime(),
                id_reason: z.number().min(1),
                content: z.string().max(255),
                id_post: z.number().min(1).nullable(),
                id_comment: z.number().min(1).nullable(),
              }),
            ),
          },
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['blog'],
});

export const createReportComment = createRoute({
  method: 'post',
  path: '/comments/{id_comment}/reports',
  summary: 'Create a response to a report',
  description: 'Create a response to a report',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: z.object({
      id_comment: z.coerce.number(),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            id_reason: z.number().min(1),
            content: z.string().max(255),
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
            id: z.number().min(1),
            content: z.string().max(255),
          }),
        },
      },
    },
    400: badRequestSchema,
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['blog'],
});
