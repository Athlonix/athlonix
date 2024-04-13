import { createRoute } from '@hono/zod-openapi';
import { number, z } from 'zod';
import authMiddleware from '../middlewares/auth.js';
import {
  commentSchema,
  insertCommentSchema,
  insertPostSchema,
  insertResponseSchema,
  postSchema,
  updatePostSchema,
} from '../validators/blog.js';
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

export const commentOnPost = createRoute({
  method: 'post',
  path: '/posts/{id}/comments',
  summary: 'Comment on a post',
  description: 'Comment on a post',
  middleware: authMiddleware,
  request: {
    params: idParamValidator,
    body: {
      content: {
        'application/json': {
          schema: insertCommentSchema,
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
            id: number().min(1),
            content: z.string().max(255),
            created_at: z.string(),
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

export const getComments = createRoute({
  method: 'get',
  path: '/posts/{id}/comments',
  summary: 'Get comments on a post',
  description: 'Get comments on a post',
  request: {
    params: idParamValidator,
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: {
            data: z.array(commentSchema),
          },
        },
      },
    },
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['blog'],
});

export const createResponse = createRoute({
  method: 'post',
  path: '/posts/{id_post}/comments/{id_comment}/responses',
  summary: 'Create a response',
  description: 'Create a response',
  middleware: authMiddleware,
  request: {
    params: z.object({
      id_post: z.coerce.number().min(1),
      id_comment: z.coerce.number().min(1),
    }),
    body: {
      content: {
        'application/json': {
          schema: insertResponseSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: insertResponseSchema,
        },
      },
    },
    400: badRequestSchema,
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['blog'],
});

export const updateComment = createRoute({
  method: 'patch',
  path: '/posts/{id}/comments/{id_comment}',
  middleware: authMiddleware,
  summary: 'Update a comment',
  description: 'Update a comment',
  request: {
    params: z.object({
      id_post: z.coerce.number(),
      id_comment: z.coerce.number(),
    }),
    body: {
      content: {
        'application/json': {
          schema: insertCommentSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: insertCommentSchema,
        },
      },
    },
    400: badRequestSchema,
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['blog'],
});

export const deleteComment = createRoute({
  method: 'delete',
  path: '/posts/{id}/comments/{id_comment}',
  middleware: authMiddleware,
  summary: 'Delete a comment',
  description: 'Delete a comment',
  request: {
    params: z.object({
      id_post: z.coerce.number(),
      id_comment: z.coerce.number(),
    }),
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
