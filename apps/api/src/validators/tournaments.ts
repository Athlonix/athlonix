import { z } from '@hono/zod-openapi';

export const tournamentSchema = z.object({
  id: z.number(),
  default_match_length: z.number().min(1).nullable(),
  name: z.string().max(255),
  max_participants: z.number().min(1),
  team_capacity: z.number().min(1),
  rules: z.string().nullable(),
  prize: z.string().nullable(),
  id_address: z.number().min(1).nullable(),
  created_at: z.string().datetime(),
  description: z.string().nullable(),
  id_sport: z.number().min(1).nullable(),
});

export const createTournamentSchema = z.object({
  default_match_length: z.coerce.number().min(1).optional(),
  name: z.string().max(255),
  max_participants: z.coerce.number().min(1),
  team_capacity: z.coerce.number().min(1),
  rules: z.string().optional(),
  prize: z.string().optional(),
  id_address: z.coerce.number().min(1).optional(),
  description: z.string().optional(),
  id_sport: z.coerce.number().min(1).optional(),
  image: z.instanceof(File),
});

export const matchSchema = z.object({
  id: z.number().min(1),
  start_time: z.string().datetime().nullable(),
  end_time: z.string().datetime().nullable(),
  winner: z.array(z.number()).nullable(),
  teams: z.array(
    z.object({
      id: z.number().min(1),
      name: z.string().max(255),
    }),
  ),
});

export const createMatchSchema = z.object({
  start_time: z.string().datetime().nullable(),
  end_time: z.string().datetime().nullable(),
  teams: z.array(z.number().min(1)).optional(),
  winner: z.array(z.number().min(1)).optional(),
});
