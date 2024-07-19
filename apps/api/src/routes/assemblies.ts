import { createRoute, z } from '@hono/zod-openapi';
import authMiddleware from '../middlewares/auth.js';
import { queryAllSchema } from '../utils/pagnination.js';
import {
  assemblySchema,
  assemblySchemaResponse,
  insertAssemblySchema,
  updateAssemblySchema,
} from '../validators/assemblies.js';
import { badRequestSchema, idParamValidator, notFoundSchema, serverErrorSchema } from '../validators/general.js';

export const getAllAssemblies = createRoute({
  method: 'get',
  path: '/assemblies',
  summary: 'Get all assemblies',
  description: 'Get all assemblies with pagination and filtering options',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    query: queryAllSchema.extend({
      date: z.string().optional(),
      location: z.coerce.number().optional(),
    }),
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: z.object({
            data: z.array(assemblySchemaResponse),
            count: z.number(),
          }),
        },
      },
    },
    500: serverErrorSchema,
  },
  tags: ['assembly'],
});

export const getOneAssembly = createRoute({
  method: 'get',
  path: '/assemblies/{id}',
  summary: 'Get a assembly',
  description: 'Get a assembly by id',
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
          schema: assemblySchemaResponse,
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
    400: badRequestSchema,
  },
  tags: ['assembly'],
});

export const createAssembly = createRoute({
  method: 'post',
  path: '/assemblies',
  summary: 'Create a assembly',
  description: 'Create a assembly at a specific location and date',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    body: {
      content: {
        'application/json': {
          schema: insertAssemblySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: assemblySchema,
        },
      },
    },
    400: badRequestSchema,
    500: serverErrorSchema,
  },
  tags: ['assembly'],
});

export const updateAssembly = createRoute({
  method: 'patch',
  path: '/assemblies/{id}',
  summary: 'Update a assembly',
  description: 'Update a assembly',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: updateAssemblySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: assemblySchema,
        },
      },
    },
    400: badRequestSchema,
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['assembly'],
});

export const closeAssembly = createRoute({
  method: 'post',
  path: '/assemblies/{id}/close',
  summary: 'Close an assembly',
  description: 'Close an assembly',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: z.object({
            lawsuit: z.string().min(20),
            roles: z.array(z.object({ id_user: z.number().positive(), id_role: z.number().positive() })).optional(),
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
          schema: z.object({ message: z.string() }),
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['assembly'],
});

// confirm without using a QR code
export const confirmMemberPresence = createRoute({
  method: 'post',
  path: '/assemblies/{id}/confirm/{id_member}',
  summary: 'Confirm presence in assembly',
  description: 'Confirm member presence in assembly',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: z.object({
      id: z.coerce.number().min(1),
      id_member: z.coerce.number().min(1),
    }),
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
    400: badRequestSchema,
  },
  tags: ['assembly'],
});

export const generateAssemblyQrCode = createRoute({
  method: 'get',
  path: '/assemblies/{id}/qr',
  summary: 'Generate assembly QR code',
  description: 'Generate assembly QR code for members to scan and confirm presence',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'image/svg+xml': {
          schema: z.string(),
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['assembly'],
});

export const handleAssemblyCheckIn = createRoute({
  method: 'post',
  path: '/assemblies/check-in',
  summary: 'Check in assembly',
  description: 'Check in assembly using QR code',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: z.object({ code: z.string() }),
        },
      },
    },
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
    400: badRequestSchema,
  },
  tags: ['assembly'],
});

export const isAlreadyConfirmed = createRoute({
  method: 'post',
  path: '/assemblies/check-confirm-member',
  summary: 'Check if member is already confirmed',
  description: 'Check if member is already confirmed in assembly',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({ code: z.string() }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: z.object({ confirmed: z.boolean() }),
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
    400: badRequestSchema,
  },
  tags: ['assembly'],
});
