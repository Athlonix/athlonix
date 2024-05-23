import { z } from 'zod';

export const activitySchema = z.object({
  id: z.coerce.number(),
  name: z.string().max(50),
  description: z.string().max(255).nullable(),
  max_participants: z.coerce.number().min(1),
  min_participants: z.coerce.number().min(1),
  days_of_week: z
    .array(z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']))
    .nullable(),
  frequency: z.enum(['weekly', 'monthly', 'yearly', 'daily']),
  start_date: z.string().date().nullable(),
  end_date: z.string().date().nullable(),
  start_time: z.string().time(),
  end_time: z.string().time(),
  id_sport: z.coerce.number().nullable(),
  id_address: z.coerce.number().nullable(),
});

export const activitySchemaReponse = activitySchema.merge(
  z.object({
    sport: z
      .object({
        id: z.coerce.number(),
        name: z.string().max(50),
      })
      .nullable(),
  }),
);

export const userActivities = z.object({
  active: z.boolean(),
  created_at: z.string(),
  id_user: z.number(),
  id_activity: z.number(),
  activity: activitySchemaReponse.omit({ sport: true }).nullable(),
});
