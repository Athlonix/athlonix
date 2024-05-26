import { z } from 'zod';

export const taskSchema = z.object({
  id: z.coerce.number().min(1),
  created_at: z.string().date(),
  priority: z.enum(['P0', 'P1', 'P2', 'P3']),
  status: z.enum(['not started', 'in progress', 'completed']),
  title: z.string().min(3),
  description: z.string().nullable(),
  id_employee: z.coerce.number().min(1).nullable(),
});
