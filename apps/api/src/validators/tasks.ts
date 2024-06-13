import { z } from '@hono/zod-openapi';
const priority = z.enum(['P0', 'P1', 'P2', 'P3']);
const status = z.enum(['not started', 'in progress', 'completed']);

export const taskSchema = z.object({
  id: z.coerce.number().min(1),
  created_at: z.string().date(),
  id_activity_exception: z.coerce.number().min(1).nullable(),
  priority: priority,
  status: status,
  title: z.string().min(3),
  description: z.string().nullable(),
  id_employee: z.coerce.number().min(1).nullable(),
});

export const queryAllTasks = z.object({
  skip: z.coerce.number().int().min(0).default(0),
  take: z.coerce.number().int().min(1).default(10),
  start_date: z.string().date(),
  end_date: z.string().date(),
});
