import { z } from 'zod';

export const postSchema = z.object({
  content: z
    .string()
    .min(1, "Post content cannot be empty")
    .max(1000, "Post content must be under 1000 characters"),
});