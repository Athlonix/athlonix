import { z } from '@hono/zod-openapi';

export const queryAllSchema = z.object({
  skip: z.coerce.number().int().min(0).default(0),
  take: z.coerce.number().int().min(1).default(10),
  search: z.string().optional(),
  all: z.preprocess((val) => val === 'true', z.boolean()).default(false),
});

export const queryAllUsersSchema = z.object({
  skip: z.coerce.number().int().min(0).default(0),
  take: z.coerce.number().int().min(1).default(10),
  search: z.string().optional(),
  all: z.preprocess((val) => val === 'true', z.boolean()).default(false),
  role: z.string().optional(),
});

export const getPagination = (page: number, size: number): { from: number; to: number } => {
  const from = size * page;
  const to = from + size - 1;

  return { from, to };
};
