import middy from "@middy/core";
import { errorHandler } from "../../middlewares/errorHandler.js";
import { getComments } from "../../services/commentService.js";
import { sendResponse } from "../../utils/response.js";

const getAll = async (event) => {
  const comments = await getComments(event.pathParameters.postId);
  return sendResponse(200, comments);
};

export const handler = middy(getAll).use(errorHandler());
