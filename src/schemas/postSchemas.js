import { z } from "zod";

export const postQuerySchema = z.strictObject({
  username: z.string().trim().min(1, "username cannot be empty").optional(),
});

export const postBodySchema = z.object({
  title: z
    .string({ error: "title is required" })
    .trim()
    .min(1, "title is required")
    .max(100, "title must be at most 100 characters"),
  content: z
    .string({ error: "content is required" })
    .trim()
    .min(1, "content is required")
    .max(1000, "content must be at most 1000 characters"),
});
