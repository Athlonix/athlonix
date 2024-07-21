import { z } from 'zod';

const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const blogFormSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Le champ est requis et doit faire minimum 5 caracteres' })
    .max(200, { message: 'Maximum 200 caractères' }),
  content: z
    .string()
    .min(10, { message: 'Le champs est requis et doit faire au minimum 10 caractères' })
    .max(5000, { message: 'Maximum 5000 caractères' }),
  description: z.string().optional(),
  cover_image: z
    .any()
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, {
      message: `L'image doit faire moins de ${MAX_FILE_SIZE / 1000000} Mo`,
    })
    .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), {
      message: "L'image doit être au format jpeg, png ou wepb",
    })
    .optional(),
});
