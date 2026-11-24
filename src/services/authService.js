import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "@middy/util";
import {
  createUser,
  getUserByUsername,
} from "../repositories/userRepository.js";

export const registerUser = async ({ username, password }) => {
  const passwordHash = await bcrypt.hash(password, 10);

  const created = await createUser({
    username,
    passwordHash,
    createdAt: new Date().toISOString(),
  });

  if (!created) throw createError(409, "Username is already taken");

  return { username };
};

export const loginUser = async ({ username, password }) => {
  const user = await getUserByUsername(username);
  const passwordMatches =
    user && (await bcrypt.compare(password, user.passwordHash));

  if (!passwordMatches) {
    throw createError(401, "Invalid username or password");
  }

  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return { token, username: user.username };
};
