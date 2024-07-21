import { createRoute, z } from '@hono/zod-openapi';
import authMiddleware from '../middlewares/auth.js';
import { queryAllSchema } from '../utils/pagnination.js';
import { badRequestSchema, idParamValidator, notFoundSchema, serverErrorSchema } from '../validators/general.js';
import { proposalSchema } from '../validators/proposals.js';

export const getAllProposals = createRoute({
  method: 'get',
  path: '/proposals',
  summary: 'Get all proposals',
  description: 'Get all proposals',
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
            data: z.array(
              proposalSchema.extend({ user: z.object({ first_name: z.string(), last_name: z.string() }).nullable() }),
            ),
            count: z.number(),
          }),
        },
      },
    },
    500: serverErrorSchema,
  },
  tags: ['proposal'],
});

export const createProposal = createRoute({
  method: 'post',
  path: '/proposals',
  summary: 'Create a proposal',
  description: 'Create a proposal',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            proposal: z.string().min(1).max(255),
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
          schema: proposalSchema,
        },
      },
    },
    400: badRequestSchema,
    500: serverErrorSchema,
  },
  tags: ['proposal'],
});

export const deleteProposal = createRoute({
  method: 'delete',
  path: '/proposals/{id}',
  summary: 'Delete a proposal',
  description: 'Delete a proposal',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
  },
  responses: {
    200: {
      description: 'Successful response',
    },
    404: notFoundSchema,
    500: serverErrorSchema,
  },
  tags: ['proposal'],
});
