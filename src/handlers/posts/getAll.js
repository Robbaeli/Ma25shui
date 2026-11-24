import middy from "@middy/core";
import { validateQuery } from "../../middlewares/validateQuery.js";
import { errorHandler } from "../../middlewares/errorHandler.js";
import { postQuerySchema } from "../../schemas/postSchemas.js";
import { getPosts } from "../../services/postService.js";
import { sendResponse } from "../../utils/response.js";

const getAll = async (event) => {
  const posts = await getPosts(event.queryStringParameters.username);
  return sendResponse(200, posts);
};

export const handler = middy(getAll)
  .use(validateQuery(postQuerySchema))
  .use(errorHandler());
