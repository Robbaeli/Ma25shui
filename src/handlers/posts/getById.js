import middy from "@middy/core";
import { errorHandler } from "../../middlewares/errorHandler.js";
import { getPost } from "../../services/postService.js";
import { sendResponse } from "../../utils/response.js";

const getById = async (event) => {
  const post = await getPost(event.pathParameters.postId);
  return sendResponse(200, post);
};

export const handler = middy(getById).use(errorHandler());
