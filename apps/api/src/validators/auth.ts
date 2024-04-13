import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string(),
  password: z.string().min(8),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  username: z.string().optional(),
});

export const userSchema = z.object({
  id: z.number(),
  email: z.string(),
  username: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  id_referer: z.number(),
  id_role: z.number(),
  id_auth: z.number(),
});

export const loginSchema = z.object({
  email: z.string(),
  password: z.string().min(8),
});

export const refreshTokenSchema = z.object({
  refresh_token: z.string(),
});
