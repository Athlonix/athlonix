import { z } from 'zod';

export const postSchema = z.object({
  id: z.number().min(1),
  title: z.string(),
  content: z.string(),
});

export const insertPostSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const updatePostSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});

// same for update
export const insertCommentSchema = z.object({
  content: z.string().max(255),
});

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
  id_post: z.number().min(1),
  responses: z.array(responseSchema).optional(),
  updated_at: z.string().nullable(),
  created_at: z.string(),
});
