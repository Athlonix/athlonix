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
  description: z.string(),
  owner: z.number().min(1),
  isAdmin: z.boolean(),
  updated_at: z.string().datetime(),
  created_at: z.string().datetime(),
  type: z.string(),
  assembly: z.number().min(1).nullable(),
  folder: z.number().min(1).nullable(),
});

export const folderSchema = z.object({
  id: z.number().min(1),
  name: z.string(),
  parent: z.number().min(1).nullable(),
  creator: z.number().min(1),
  created_at: z.string().datetime(),
  isAdmin: z.boolean(),
});

export const getAllFiles = createRoute({
  method: 'get',
  path: '/edm/listFiles',
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
            files: z.array(documentSchema).nullable(),
            filesCount: z.number(),
            folders: z.array(folderSchema).nullable(),
            foldersCount: z.number(),
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
  path: '/edm/download/{id}',
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
  path: '/edm/upload',
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
            description: z.string(),
            assembly: z
              .string()
              .optional()
              .transform((value) => {
                if (value === 'null') {
                  return null;
                }
                return Number(value);
              }),
            folder: z.string().transform((value) => {
              if (value === 'null') {
                return null;
              }
              return Number(value);
            }),
            isAdmin: z
              .string()
              .optional()
              .transform((value) => {
                if (value === 'true') {
                  return true;
                }
                return false;
              }),
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
  path: '/edm/update/{id}',
  summary: 'Update a file',
  description: 'Udpdate a file to a bucket',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'multipart/form-data': {
          schema: z.object({
            file: z.instanceof(File).optional(),
            name: z.string().optional(),
            folder: z.string().transform((value) => {
              if (value === 'null') {
                return null;
              }
              return Number(value);
            }),
            assembly: z
              .string()
              .optional()
              .transform((value) => {
                if (value === 'null') {
                  return null;
                }
                return Number(value);
              }),
            isAdmin: z
              .string()
              .optional()
              .transform((value) => {
                if (value === 'true') {
                  return true;
                }
                return false;
              }),
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
  path: '/edm/delete',
  summary: 'Delete a file',
  description: 'Delete a file from a bucket',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            id: z.coerce.number(),
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

export const createFolderRoute = createRoute({
  method: 'post',
  path: '/edm/folder',
  summary: 'Create a folder',
  description: 'Create a folder in a bucket',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            name: z.string(),
            parent: z.number().min(1).nullable(),
            isAdmin: z.boolean().default(false),
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
            message: z.string(),
          }),
        },
      },
    },
    500: serverErrorSchema,
  },
  tags: ['edm'],
});

export const deleteFolderRoute = createRoute({
  method: 'delete',
  path: '/edm/folder/{id}',
  summary: 'Delete a folder',
  description: 'Delete a folder from a bucket',
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
    400: badRequestSchema,
    404: notFoundSchema,
  },
  tags: ['edm'],
});

export const updateFolderRoute = createRoute({
  method: 'patch',
  path: '/edm/folder/{id}',
  summary: 'Update a folder',
  description: 'Update a folder in a bucket',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: z.object({
            name: z.string(),
            parent: z.number().min(1).nullable(),
            isAdmin: z.boolean().default(false),
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
            data: folderSchema.nullable(),
          }),
        },
      },
    },
    500: serverErrorSchema,
    400: badRequestSchema,
    404: notFoundSchema,
  },
  tags: ['edm'],
});
