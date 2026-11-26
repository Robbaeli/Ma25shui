import { z } from "zod";

export const commentBodySchema = z.object({
  content: z
    .string({ error: "content is required" })
    .trim()
    .min(1, "content is required")
    .max(500, "content must be at most 500 characters"),
});
