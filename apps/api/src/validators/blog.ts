import { z } from 'zod';

export const postSchema = z.object({
  id: z.number().min(1),
  title: z.string(),
  content: z.string(),
});

export const inserPostSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export const updatePostSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});
