import { createError } from "@middy/util";

export const validateQuery = (schema) => ({
  before: async (request) => {
    const result = schema.safeParse(request.event.queryStringParameters ?? {});
    if (!result.success) {
      throw createError(400, result.error.issues[0].message);
    }
    request.event.queryStringParameters = result.data;
  },
});
