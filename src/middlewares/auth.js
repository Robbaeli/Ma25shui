import jwt from "jsonwebtoken";
import { createError } from "@middy/util";

export const auth = () => ({
  before: async (request) => {
    const header = request.event.headers?.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      throw createError(401, "Missing or invalid token");
    }

    const token = header.slice(7);

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      request.event.user = { username: payload.username };
    } catch {
      throw createError(401, "Missing or invalid token");
    }
  },
});
