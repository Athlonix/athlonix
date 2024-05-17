import { createRoute, z } from '@hono/zod-openapi';
import { loginResponseSchema, loginSchema, signUpSchema, userSchema } from '../validators/auth.js';
import { badRequestSchema, serverErrorSchema } from '../validators/general.js';

export const signupUser = createRoute({
  method: 'post',
  path: '/signup',
  summary: 'Signup a user',
  description: 'Signup a user',
  request: {
    body: {
      content: {
        'application/json': {
          schema: signUpSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: userSchema.omit({ roles: true }),
        },
      },
    },
    400: badRequestSchema,
    500: serverErrorSchema,
  },
  tags: ['auth'],
});

export const loginUser = createRoute({
  method: 'post',
  path: '/login',
  summary: 'Login a user',
  description: 'Login a user',
  request: {
    body: {
      content: {
        'application/json': {
          schema: loginSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: loginResponseSchema,
        },
      },
    },
    400: badRequestSchema,
    500: serverErrorSchema,
  },
  tags: ['auth'],
});

export const refreshTokens = createRoute({
  method: 'post',
  path: '/refresh',
  summary: 'Refresh tokens',
  description: 'Refresh tokens',
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
  },
  tags: ['auth'],
});

export const logoutUser = createRoute({
  method: 'delete',
  path: '/logout',
  summary: 'Logout a user',
  description: 'Logout a user',
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
  },
  tags: ['auth'],
});
