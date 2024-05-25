import { z } from 'zod';
import { userSchema } from './auth.js';

export const activityMemberSchema = z
  .object({
    id_activity: z.coerce.number(),
  })
  .merge(userSchema);

const teamMemberSchema = z.object({
  id: z.coerce.number().min(1),
  username: z.string().min(2),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
});

export const activityTeamSchema = z.object({
  id_activity: z.coerce.number().min(1),
  members: z.array(teamMemberSchema),
});

export const activityMemberParamSchema = z.object({
  id_activity: z.coerce.number().min(1),
  id_user: z.coerce.number().min(1),
});
