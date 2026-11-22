import middy from "@middy/core";
import { validate } from "../../middlewares/validate.js";
import { errorHandler } from "../../middlewares/errorHandler.js";
import { loginSchema } from "../../schemas/authSchemas.js";
import { loginUser } from "../../services/authService.js";
import { sendResponse } from "../../utils/response.js";

const login = async (event) => {
  const { token, username } = await loginUser(event.body);
  return sendResponse(200, {
    message: "Login successful",
    token,
    username,
  });
};

export const handler = middy(login)
  .use(validate(loginSchema))
  .use(errorHandler());
