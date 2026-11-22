import middy from "@middy/core";
import { validate } from "../../middlewares/validate.js";
import { errorHandler } from "../../middlewares/errorHandler.js";
import { registerSchema } from "../../schemas/authSchemas.js";
import { registerUser } from "../../services/authService.js";
import { sendResponse } from "../../utils/response.js";

const register = async (event) => {
  const user = await registerUser(event.body);
  return sendResponse(201, {
    message: "User registered successfully",
    username: user.username,
  });
};

export const handler = middy(register)
  .use(validate(registerSchema))
  .use(errorHandler());
