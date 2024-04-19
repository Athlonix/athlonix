import { z } from 'zod';

export const postSchema = z.object({
  id: z.number().min(1),
  title: z.string(),
  content: z.string(),
});

export const insertPostSchema = postSchema.omit({ id: true });

export const updatePostSchema = postSchema.omit({ id: true });

export const responseSchema = z.object({
  id: z.number().min(1),
  content: z.string().max(255),
});

export const insertResponseSchema = z.object({
  content: z.string().max(255),
});

export const commentSchema = z.object({
  id: z.number().min(1),
  content: z.string().max(255),
  id_post: z.number().min(1).nullable(),
  responses: z.array(responseSchema).optional(),
  updated_at: z.string().nullable(),
  created_at: z.string(),
  id_user: z.number().min(1),
});

export const insertCommentSchema = insertResponseSchema;
