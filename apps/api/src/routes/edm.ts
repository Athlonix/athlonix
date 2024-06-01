import { createRoute, z } from '@hono/zod-openapi';
import authMiddleware from '../middlewares/auth.js';
import { queryAllSchema } from '../utils/pagnination.js';
import {
  badRequestSchema,
  idParamValidator,
  notFoundSchema,
  permissionDeniedSchema,
  serverErrorSchema,
} from '../validators/general.js';

export const documentSchema = z.object({
  id: z.number().min(1),
  name: z.string(),
  description: z.string().nullable(),
  owner: z.number().min(1),
  isAdmin: z.boolean(),
  updated_at: z.string().datetime(),
  created_at: z.string().datetime(),
  type: z.string(),
});

export const getAllFiles = createRoute({
  method: 'get',
  path: '/listFiles',
  summary: 'List all files',
  description: 'List all files from EDM bucket',
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
          schema: z.object({
            data: z.array(documentSchema),
            count: z.number(),
          }),
        },
      },
    },
    400: badRequestSchema,
    500: serverErrorSchema,
  },
  tags: ['edm'],
});

export const downloadFileRoute = createRoute({
  method: 'get',
  path: '/download/{id}',
  summary: 'Download a file',
  description: 'Download a file from a bucket',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
  },
  responses: {
    200: {
      description: 'Successful response', // TODO: find a way to specify the return type
    },
    404: notFoundSchema,
    500: serverErrorSchema,
  },
  tags: ['edm'],
});

export const uploadFileRoute = createRoute({
  method: 'post',
  path: '/upload',
  summary: 'Upload a file',
  description: 'Upload a file to a bucket',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: z.object({
            file: z.instanceof(File),
            name: z.string(),
            description: z.string().optional(),
            isAdmin: z.boolean(),
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
            message: z.string(),
          }),
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
    403: permissionDeniedSchema,
  },
  tags: ['edm'],
});

export const updateFile = createRoute({
  method: 'patch',
  path: '/upsert',
  summary: 'Upsert a file',
  description: 'Upsert a file to a bucket',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: z.object({
            file: z.instanceof(File),
            name: z.string(),
            isAdmin: z.boolean(),
            description: z.string().optional(),
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
            message: z.string(),
          }),
        },
      },
    },
    500: serverErrorSchema,
    400: badRequestSchema,
  },
  tags: ['edm'],
});

export const deleteFileRoute = createRoute({
  method: 'delete',
  path: '/delete',
  summary: 'Delete a file',
  description: 'Delete a file from a bucket',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            name: z.string(),
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
            message: z.string(),
          }),
        },
      },
    },
    500: serverErrorSchema,
    400: badRequestSchema,
  },
  tags: ['edm'],
});
