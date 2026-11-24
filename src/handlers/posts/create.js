import middy from "@middy/core";
import { optionalAuth } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { errorHandler } from "../../middlewares/errorHandler.js";
import { postBodySchema } from "../../schemas/postSchemas.js";
import { createPost } from "../../services/postService.js";
import { sendResponse } from "../../utils/response.js";

const create = async (event) => {
  const post = await createPost({
    user: event.user,
    ...event.body,
  });

  return sendResponse(201, {
    message: "Post created successfully",
    post,
  });
};

export const handler = middy(create)
  .use(optionalAuth())
  .use(validate(postBodySchema))
  .use(errorHandler());
