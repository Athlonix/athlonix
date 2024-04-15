import { z } from 'zod';

export type Variables = {
  user: {
    id: number;
    id_role: number;
    email: string;
    updated_at: string;
    created_at: string;
  };
};

export enum Role {
  CREATED = 1,
  MEMBER = 2,
  REDACTOR = 3,
  MODERATOR = 4,
  ADMIN = 5,
}

export const serverErrorSchema = {
  description: 'Internal server error',
  content: {
    'application/json': {
      schema: z.object({ error: z.string() }),
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

export const idParamValidator = z.object({
  id: z.coerce.number().min(1),
});
