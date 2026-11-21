import { sendResponse } from "../utils/response.js";

export const errorHandler = () => ({
  onError: async (request) => {
    const { error } = request;
    const statusCode = error.statusCode ?? 500;

    if (statusCode === 500) console.error(error);

    const message =
      statusCode === 500 ? "Internal server error" : error.message;
    request.response = sendResponse(statusCode, { error: message });
  },
});
