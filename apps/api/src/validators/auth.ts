import { z } from '@hono/zod-openapi';

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  username: z.string().min(2),
});

export type selectUser = {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  id_referer: number;
  id_auth: number;
  date_validity: string | null;
  created_at: string;
  roles:
    | {
        id_role: number;
        name: string;
      }[]
    | null;
};

export const userSchema = z.object({
  id: z.number().min(1),
  email: z.string().email(),
  username: z.string().min(2),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  id_referer: z.number().nullable(),
  id_auth: z.string().nullable(),
  date_validity: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
  roles: z.object({ id: z.number(), name: z.string() }).array(),
  deleted_at: z.string().datetime().nullable(),
  invoice: z.string().nullable(),
  subscription: z.string().nullable(),
});

export const loginResponseSchema = z.object({
  user: userSchema,
  token: z.string(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const refreshTokenSchema = z.object({
  refresh_token: z.string(),
});

export const updateUserSchema = z.object({
  username: z.string().min(2),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
});
