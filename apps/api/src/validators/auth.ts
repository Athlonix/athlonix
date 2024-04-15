import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  username: z.string().min(2),
});

export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  username: z.string().min(2),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  id_referer: z.number(),
  id_role: z.number(),
  id_auth: z.number(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const refreshTokenSchema = z.object({
  refresh_token: z.string(),
});
