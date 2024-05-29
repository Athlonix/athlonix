import { createRoute, z } from '@hono/zod-openapi';
import authMiddleware from '../middlewares/auth.js';
import { queryAllSchema } from '../utils/pagnination.js';
import { badRequestSchema, idParamValidator, notFoundSchema, serverErrorSchema } from '../validators/general.js';

export const materialSchema = z.object({
  id: z.number(),
  name: z.string(),
  weight_grams: z.number().nullable(),
  id_address: z.number(),
  quantity: z.number(),
});

export const getAllMaterials = createRoute({
  method: 'get',
  path: '/materials',
  summary: 'Get all materials',
  description: 'Get all materials',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    query: z.object({
      ...queryAllSchema.shape,
      addresses: z.union([z.coerce.number().array().min(1), z.string().transform((val) => [Number(val)])]),
    }),
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: z.object({
            data: z.array(materialSchema),
            count: z.number(),
          }),
        },
      },
    },
    500: serverErrorSchema,
  },
  tags: ['material'],
});

export const getMaterialById = createRoute({
  method: 'get',
  path: '/materials/{id}',
  summary: 'Get a material',
  description: 'Get a material',
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
          schema: materialSchema,
        },
      },
    },
    404: notFoundSchema,
    500: serverErrorSchema,
  },
  tags: ['material'],
});

export const createMaterial = createRoute({
  method: 'post',
  path: '/materials',
  summary: 'Create a material',
  description: 'Create a material',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            name: z.string(),
            weight_grams: z.coerce.number().optional(),
            id_address: z.coerce.number(),
            quantity: z.coerce.number(),
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
          schema: materialSchema,
        },
      },
    },
    400: badRequestSchema,
    500: serverErrorSchema,
  },
  tags: ['material'],
});

export const updateMaterial = createRoute({
  method: 'put',
  path: '/materials/{id}',
  summary: 'Update a material',
  description: 'Update a material',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: z.object({
            name: z.string().optional(),
            weight_grams: z.number().optional(),
            id_address: z.number().optional(),
            quantity: z.number().optional(),
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
          schema: materialSchema,
        },
      },
    },
    404: notFoundSchema,
    500: serverErrorSchema,
  },
  tags: ['material'],
});

export const deleteMaterial = createRoute({
  method: 'delete',
  path: '/materials/{id}',
  summary: 'Delete a material',
  description: 'Delete a material',
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
    404: notFoundSchema,
    500: serverErrorSchema,
  },
  tags: ['material'],
});
