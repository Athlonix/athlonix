import { z } from '@hono/zod-openapi';

export const messageSchema = z.object({
  id: z.number().min(1),
  id_sender: z.number().min(1),
  message: z.string().min(1),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().nullable(),
});

export const updateMessageSchema = z.object({
  message: z.string().min(1),
});
