import middy from "@middy/core";
import { auth } from "../../middlewares/auth.js";
import { validate } from "../../middlewares/validate.js";
import { errorHandler } from "../../middlewares/errorHandler.js";
import { commentBodySchema } from "../../schemas/commentSchemas.js";
import { createComment } from "../../services/commentService.js";
import { sendResponse } from "../../utils/response.js";

const create = async (event) => {
  const comment = await createComment({
    postId: event.pathParameters.postId,
    username: event.user.username,
    content: event.body.content,
  });

  return sendResponse(201, {
    message: "Comment created successfully",
    comment,
  });
};

export const handler = middy(create)
  .use(auth())
  .use(validate(commentBodySchema))
  .use(errorHandler());
