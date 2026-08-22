import {z} from 'zod';

export const updateProfileSchema = z.object({
  username: z.string().min(3, "...").optional(),
  bio: z.string().max(300, "...").optional(),
});