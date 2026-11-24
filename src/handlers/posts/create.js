import middy from "@middy/core";
import { auth } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { errorHandler } from "../../middlewares/errorHandler.js";
import { postBodySchema } from "../../schemas/postSchemas.js";
import { createPost } from "../../services/postService.js";
import { sendResponse } from "../../utils/response.js";

const create = async (event) => {
  const post = await createPost({
    username: event.user.username,
    ...event.body,
  });

  return sendResponse(201, {
    message: "Post created successfully",
    post,
  });
};

export const handler = middy(create)
  .use(auth())
  .use(validate(postBodySchema))
  .use(errorHandler());
