import { createError } from "@middy/util";

export const validate = (schema) => ({
  before: async (request) => {
    let body;
    try {
      body = JSON.parse(request.event.body || "{}");
    } catch {
      throw createError(400, "Invalid JSON");
    }

    const result = schema.safeParse(body);
    if (!result.success) {
      throw createError(400, result.error.issues[0].message);
    }

    request.event.body = result.data;
  },
});
