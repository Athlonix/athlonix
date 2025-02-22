import { z } from '@hono/zod-openapi';

export const assemblySchema = z.object({
  id: z.number().min(1),
  name: z.string().min(2),
  description: z.string().min(2).nullable(),
  date: z.string().datetime(),
  location: z.number().min(1).nullable(),
  lawsuit: z.string().nullable(),
  closed: z.boolean().nullable(),
});

export const insertAssemblySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  location: z.number().min(1).nullable(),
  date: z.string().datetime(),
});

export const updateAssemblySchema = assemblySchema.omit({ id: true }).partial();

export const assemblySchemaResponse = z.object({
  id: z.number().min(1),
  name: z.string(),
  description: z.string().nullable(),
  date: z.string().datetime(),
  location: z.number().min(1).nullable(),
  attendees: z
    .object({
      id: z.number().min(1),
      first_name: z.string(),
      last_name: z.string(),
      email: z.string().email(),
    })
    .array(),
  lawsuit: z.string().nullable(),
  closed: z.boolean().nullable(),
});
