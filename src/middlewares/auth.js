import jwt from "jsonwebtoken";
import { createError } from "@middy/util";

const getUserFromHeader = (header) => {
  if (!header.startsWith("Bearer ")) {
    throw createError(401, "Missing or invalid token");
  }

  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    return { username: payload.username };
  } catch {
    throw createError(401, "Missing or invalid token");
  }
};

export const auth = () => ({
  before: async (request) => {
    const header = request.event.headers?.authorization;
    if (!header) throw createError(401, "Missing or invalid token");
    request.event.user = getUserFromHeader(header);
  },
});

export const optionalAuth = () => ({
  before: async (request) => {
    const header = request.event.headers?.authorization;
    request.event.user = header ? getUserFromHeader(header) : null;
  },
});
