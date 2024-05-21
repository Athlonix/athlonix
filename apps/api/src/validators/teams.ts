import { z } from 'zod';
import { userSchema } from './auth.js';

export const activityMemberSchema = z
  .object({
    id_activity: z.coerce.number(),
  })
  .merge(userSchema);

export const activityMemberParamSchema = z.object({
  id_activity: z.coerce.number().min(1),
  id_user: z.coerce.number().min(1),
});