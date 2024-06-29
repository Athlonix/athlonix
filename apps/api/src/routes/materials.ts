import { createRoute, z } from '@hono/zod-openapi';
import authMiddleware from '../middlewares/auth.js';
import { badRequestSchema, idParamValidator, notFoundSchema, serverErrorSchema } from '../validators/general.js';

export const materialSchema = z.object({
  id: z.number().min(1),
  name: z.string().min(2),
  weight_grams: z.number().positive().nullable(),
  id_address: z.number().min(1),
  quantity: z.number().positive(),
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
      search: z.string().optional(),
      all: z.coerce.boolean().optional().default(false),
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
            name: z.string().min(2),
            weight_grams: z.coerce.number().optional(),
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
          schema: materialSchema.omit({ id_address: true, quantity: true }),
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
            name: z.string().min(2).optional(),
            weight_grams: z.coerce.number().optional(),
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
          schema: materialSchema.omit({ id_address: true, quantity: true }),
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

export const changeMaterialQuantity = createRoute({
  method: 'patch',
  path: '/materials/{id}/quantity',
  summary: 'Change the quantity of a material',
  description: 'Change the quantity of a material',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: z.object({
            quantity: z.coerce.number().positive(),
            id_address: z.coerce.number().min(1),
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
    404: notFoundSchema,
    500: serverErrorSchema,
  },
  tags: ['material'],
});

export const addMaterial = createRoute({
  method: 'post',
  path: '/materials/{id}/add',
  summary: 'Add a material',
  description: 'Add a material',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: z.object({
            id_address: z.coerce.number().min(1),
            quantity: z.coerce.number().positive(),
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
          schema: z.object({ message: z.string() }),
        },
      },
    },
    404: notFoundSchema,
    500: serverErrorSchema,
  },
  tags: ['material'],
});

export const removeMaterial = createRoute({
  method: 'delete',
  path: '/materials/{id}/remove',
  summary: 'Remove a material',
  description: 'Remove a material',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: z.object({
            id_address: z.coerce.number().min(1),
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
    404: notFoundSchema,
    500: serverErrorSchema,
  },
  tags: ['material'],
});
