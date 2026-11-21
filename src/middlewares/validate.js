import { HttpError } from "../utils/HttpError.js";

export const validate = (schema) => ({
  before: async (request) => {
    let body;
    try {
      body = JSON.parse(request.event.body || "{}");
    } catch {
      throw new HttpError(400, "Invalid JSON");
    }

    const result = schema.safeParse(body);
    if (!result.success) {
      throw new HttpError(400, result.error.issues[0].message);
    }

    request.event.body = result.data;
  },
});
