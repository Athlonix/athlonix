import { createRoute } from '@hono/zod-openapi';
import { z } from 'zod';
import authMiddleware from '../middlewares/auth.js';
import { insertPostSchema, postSchema, updatePostSchema } from '../validators/blog.js';
import { badRequestSchema, idParamValidator, notFoundSchema, serverErrorSchema } from '../validators/general.js';

export const getAllPosts = createRoute({
  method: 'get',
  path: '/posts',
  summary: 'Get all posts',
  description: 'Get all posts',
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: {
            data: z.array(postSchema),
          },
        },
      },
    },
    500: serverErrorSchema,
  },
  tags: ['blog'],
});

export const getPost = createRoute({
  method: 'get',
  path: '/posts/{id}',
  summary: 'Get a post',
  description: 'Get a post',
  request: {
    params: idParamValidator,
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: {
            data: postSchema,
          },
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['blog'],
});

export const createPost = createRoute({
  method: 'post',
  path: '/posts',
  middleware: authMiddleware,
  summary: 'Create a post',
  description: 'Create a post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: insertPostSchema,
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
            data: postSchema,
          },
        },
      },
    },
    400: badRequestSchema,
    500: serverErrorSchema,
  },
  tags: ['blog'],
});

export const updatePost = createRoute({
  method: 'patch',
  path: '/posts/{id}',
  middleware: authMiddleware,
  summary: 'Update a post',
  description: 'Update a post',
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: updatePostSchema,
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
            data: postSchema,
          },
        },
      },
    },
    400: badRequestSchema,
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['blog'],
});

export const deletePost = createRoute({
  method: 'delete',
  path: '/posts/{id}',
  middleware: authMiddleware,
  summary: 'Delete a post',
  description: 'Delete a post',
  request: {
    params: idParamValidator,
  },
  responses: {
    204: {
      description: 'Successful response',
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['blog'],
});
