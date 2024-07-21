import { z } from '@hono/zod-openapi';

export const proposalSchema = z.object({
  id: z.number().min(1),
  proposal: z.string().min(1).max(255),
  id_user: z.number().min(1),
  created_at: z.string().datetime(),
});
