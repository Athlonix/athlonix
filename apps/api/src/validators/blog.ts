import { z } from 'zod';

export const postSchema = z.object({
  id: z.number().min(1),
  title: z.string(),
  content: z.string(),
  cover_image: z.string().nullable(),
  description: z.string().nullable(),
});

export const postCardSchemaResponse = z.object({
  id: z.number().min(1),
  title: z.string(),
  created_at: z.string(),
  cover_image: z.string().nullable(),
  description: z.string().nullable(),
  author: z.object({ id: z.number(), username: z.string() }).nullable(),
  categories: z.object({ id: z.number().nullable(), name: z.string().nullable() }).array(),
  comments: z.object({ id: z.number() }).array(),
  reports: z.object({ id: z.number() }).array(),
  comments_number: z.number().min(0),
  views_number: z.number().min(0),
  likes_number: z.number().min(0),
});

export const postCardListSchemaResponse = z.array(postCardSchemaResponse);

export const insertPostSchema = postSchema.omit({ id: true });

export const updatePostSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  cover_image: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
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
  id_post: z.number().min(1).nullable(),
  responses: z.array(responseSchema).optional(),
  updated_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
  id_user: z.number().min(1),
});

export const insertCommentSchema = insertResponseSchema;
