import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string(),
  password: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string(),
  password: z.string().min(8),
});

export const refreshTokenSchema = z.object({
  refresh_token: z.string(),
});
