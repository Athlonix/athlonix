import { z } from '@hono/zod-openapi';

export const activitySchema = z.object({
  id: z.coerce.number(),
  name: z.string().max(50),
  description: z.string().max(255).nullable(),
  max_participants: z.coerce.number().min(1),
  min_participants: z.coerce.number().min(1),
  days_of_week: z
    .array(z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']))
    .nullable(),
  frequency: z.enum(['weekly', 'monthly', 'yearly', 'unique']),
  start_date: z.string().date().nullable(),
  end_date: z.string().date().nullable(),
  start_time: z.string().time().nullable(),
  end_time: z.string().time().nullable(),
  id_sport: z.coerce.number().nullable(),
  id_address: z.coerce.number().nullable(),
});

export const createActivitySchema = z.object({
  name: z.string().max(50),
  description: z.string().max(255).optional(),
  max_participants: z.coerce.number().min(1),
  min_participants: z.coerce.number().min(1),
  days_of_week: z.string().optional(),
  frequency: z.enum(['weekly', 'monthly', 'yearly', 'unique']),
  start_date: z.string().date().optional(),
  end_date: z.string().date().optional(),
  start_time: z.string().time().optional(),
  end_time: z.string().time().optional(),
  id_sport: z.coerce.number().optional(),
  id_address: z.coerce.number().optional(),
  image: z.instanceof(File),
});

export const activitySchemaReponse = z.object({
  id: z.coerce.number(),
  name: z.string().max(50),
  description: z.string().max(255).nullable(),
  max_participants: z.coerce.number().min(1),
  min_participants: z.coerce.number().min(1),
  days_of_week: z
    .array(z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']))
    .nullable(),
  frequency: z.enum(['weekly', 'monthly', 'yearly', 'unique']).nullable(),
  start_date: z.string().date().nullable(),
  end_date: z.string().date().nullable(),
  start_time: z.string().time().nullable(),
  end_time: z.string().time().nullable(),
  id_sport: z.coerce.number().nullable(),
  id_address: z.coerce.number().nullable(),
  sport: z
    .object({
      id: z.coerce.number(),
      name: z.string().max(50),
    })
    .nullable(),
});

export const userActivities = z.object({
  active: z.boolean(),
  created_at: z.string(),
  id_user: z.number(),
  id_activity: z.number(),
  activity: activitySchemaReponse.omit({ sport: true }).nullable(),
});

export const activityExceptionSchema = z.object({
  id: z.coerce.number().min(1),
  id_activity: z.coerce.number().min(1),
  date: z.string().date(),
  max_participants: z.coerce.number().min(1).nullable(),
  min_participants: z.coerce.number().min(1).nullable(),
});

export const queryActivitiesExceptionSchema = z.object({
  start_date: z.string().date(),
  end_date: z.string().date(),
  all: z.coerce.boolean().optional().default(false),
});

export const activityOccurencesSchema = z.object({
  activity: activitySchemaReponse,
  occurences: z.array(
    z.object({
      id_exception: z.coerce.number().min(1).nullable(),
      date: z.string().date(),
      max_participants: z.coerce.number().min(1).nullable(),
      min_participants: z.coerce.number().min(1).nullable(),
    }),
  ),
});
