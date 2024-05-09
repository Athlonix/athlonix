import { createRoute } from '@hono/zod-openapi';
import { number, z } from 'zod';
import authMiddleware from '../middlewares/auth.js';
import { queryAllSchema } from '../utils/pagnination.js';
import {
  commentSchema,
  insertCommentSchema,
  insertPostSchema,
  insertResponseSchema,
  postCardListSchemaResponse,
  postSchema,
  reportSchema,
  responseSchema,
  updatePostSchema,
} from '../validators/blog.js';
import { badRequestSchema, idParamValidator, notFoundSchema, serverErrorSchema } from '../validators/general.js';

export const getAllPosts = createRoute({
  method: 'get',
  path: '/posts',
  summary: 'Get all posts',
  description: 'Get all posts',
  request: {
    query: queryAllSchema,
  },
  responses: {
    200: {
      description: 'Successful response',
      content: {
        'application/json': {
          schema: {
            data: postCardListSchemaResponse,
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
  security: [{ Bearer: [] }],
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
  security: [{ Bearer: [] }],
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
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  summary: 'Delete a post',
  description: 'Delete a post',
  request: {
    params: idParamValidator,
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

export const softDeletePost = createRoute({
  method: 'patch',
  path: '/posts/{id}/soft',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  summary: 'Soft delete a post',
  description: 'Soft delete a post',
  request: {
    params: idParamValidator,
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

export const commentOnPost = createRoute({
  method: 'post',
  path: '/posts/{id}/comments',
  summary: 'Comment on a post',
  description: 'Comment on a post',
  security: [{ Bearer: [] }],
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
  summary: 'Get comments and responses on a post',
  description: 'Get comments and responses on a post',
  request: {
    params: idParamValidator,
    query: queryAllSchema,
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
  security: [{ Bearer: [] }],
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
          schema: responseSchema,
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
  path: '/posts/{id_post}/comments/{id_comment}',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  summary: 'Update a comment or a response',
  description: 'Update a comment or a response',
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
          schema: commentSchema,
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
  path: '/posts/{id_post}/comments/{id_comment}',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  summary: 'Delete a comment or a response',
  description: 'Delete a comment or a response',
  request: {
    params: z.object({
      id_post: z.coerce.number(),
      id_comment: z.coerce.number(),
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

export const getReports = createRoute({
  method: 'get',
  path: '/posts/{id_post}/reports',
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
            data: z.array(reportSchema),
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
  path: '/posts/{id_post}/reports',
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
          schema: reportSchema,
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
  path: '/posts/{id_post}/reports/{id}',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  summary: 'Delete a report',
  description: 'Delete a report',
  request: {
    params: z.object({
      id_post: z.coerce.number().optional(),
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
  path: '/posts/{id_post}/reports/{id_comment}/comments',
  summary: 'Get comments and responses on a report',
  description: 'Get comments and responses on a report',
  request: {
    params: z.object({
      id_post: z.coerce.number(),
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
            data: z.array(reportSchema),
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
  path: '/posts/{id_post}/reports/{id_comment}/comments',
  summary: 'Create a response to a report',
  description: 'Create a response to a report',
  security: [{ Bearer: [] }],
  middleware: authMiddleware,
  request: {
    params: z.object({
      id_post: z.coerce.number(),
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
          schema: responseSchema,
        },
      },
    },
    400: badRequestSchema,
    500: serverErrorSchema,
    404: notFoundSchema,
  },
  tags: ['blog'],
});
