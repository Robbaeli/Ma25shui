import middy from "@middy/core";
import { auth } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { errorHandler } from "../../middlewares/errorHandler.js";
import { postBodySchema } from "../../schemas/postSchemas.js";
import { updatePost } from "../../services/postService.js";
import { sendResponse } from "../../utils/response.js";

const update = async (event) => {
  const post = await updatePost({
    postId: event.pathParameters.postId,
    username: event.user.username,
    ...event.body,
  });

  return sendResponse(200, {
    message: "Post updated successfully",
    post,
  });
};

export const handler = middy(update)
  .use(auth())
  .use(validate(postBodySchema))
  .use(errorHandler());
