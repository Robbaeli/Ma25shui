import bcrypt from "bcryptjs";
import { createUser } from "../repositories/userRepository.js";
import { HttpError } from "../utils/HttpError.js";

export const registerUser = async ({ username, password }) => {
  const passwordHash = await bcrypt.hash(password, 10);

  const created = await createUser({
    username,
    passwordHash,
    createdAt: new Date().toISOString(),
  });

  if (!created) throw new HttpError(409, "Username is already taken");

  return { username };
};
