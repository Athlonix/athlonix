import { z } from 'zod';

export const paginationSchema = z.object({
  skip: z.coerce.number().int().min(0).default(0),
  take: z.coerce.number().int().min(1).default(10),
});

export const getPagination = (page: number, size: number): { from: number; to: number } => {
  const limit = size ? size : 10;
  const from = page ? page * limit : 0;
  const to = page ? from + size : size;

  return { from, to };
};
