import { z } from 'zod';

export const activitySchemaReponse = z.object({
  id: z.coerce.number(),
  name: z.string().max(50),
  description: z.string().max(255).nullable(),
  max_participants: z.coerce.number().min(1),
  min_participants: z.coerce.number().min(1),
  days: z.array(z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])),
  recurrence: z.enum(['weekly', 'monthly', 'annual']),
  interval: z.coerce.number().min(1),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  sport: z.object({
    id: z.coerce.number().nullable(),
    name: z.string(),
  }),
  id_address: z.coerce.number().nullable(),
});
