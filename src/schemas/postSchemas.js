import { z } from "zod";

export const postQuerySchema = z.strictObject({
  username: z.string().trim().min(1, "username cannot be empty").optional(),
});
