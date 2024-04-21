import { z } from 'zod';

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
  date_validity: string;
  created_at: string;
  roles:
    | {
        id_role: number;
      }[]
    | null;
};

export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  username: z.string().min(2),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  id_referer: z.number(),
  id_auth: z.number(),
  date_validity: z.string(),
  created_at: z.string(),
  roles: z.array(z.number().min(1)).nullable(),
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
