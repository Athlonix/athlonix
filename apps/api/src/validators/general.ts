import { z } from '@hono/zod-openapi';

export type Variables = {
  user: {
    id: number;
    roles: number[];
    date_validity: string;
    email: string;
    updated_at: string;
    created_at: string;
  };
};

export enum Role {
  BANNED = 1,
  MEMBER = 2,
  REDACTOR = 3,
  MODERATOR = 4,
  ADMIN = 5,
  DIRECTOR = 6,
  SECRATARY = 7,
  TREASURER = 8,
  PRESIDENT = 9,
  EMPLOYEE = 10,
}

export const serverErrorSchema = {
  description: 'Internal server error',
  content: {
    'application/json': {
      schema: z.object({
        error: z.string(),
      }),
    },
  },
};

export const badRequestSchema = {
  description: 'Bad request',
  content: {
    'application/json': {
      schema: z.object({
        error: z.string(),
      }),
    },
  },
};

export const notFoundSchema = {
  description: 'Not found',
  content: {
    'application/json': {
      schema: z.object({
        error: z.string(),
      }),
    },
  },
};

export const permissionDeniedSchema = {
  description: 'Permission denied',
  content: {
    'application/json': {
      schema: z.object({
        error: z.string(),
      }),
    },
  },
};

export const idParamValidator = z.object({
  id: z.coerce.number().min(1),
});
