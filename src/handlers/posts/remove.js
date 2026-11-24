import middy from "@middy/core";
import { auth } from "../../middlewares/auth.js";
import { errorHandler } from "../../middlewares/errorHandler.js";
import { deletePost } from "../../services/postService.js";
import { sendResponse } from "../../utils/response.js";

const remove = async (event) => {
  await deletePost({
    postId: event.pathParameters.postId,
    username: event.user.username,
  });

  return sendResponse(204);
};

export const handler = middy(remove).use(auth()).use(errorHandler());
