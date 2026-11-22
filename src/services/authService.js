import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  createUser,
  getUserByUsername,
} from "../repositories/userRepository.js";
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

export const loginUser = async ({ username, password }) => {
  const user = await getUserByUsername(username);
  const passwordMatches =
    user && (await bcrypt.compare(password, user.passwordHash));

  if (!passwordMatches) {
    throw new HttpError(401, "Invalid username or password");
  }

  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return { token, username: user.username };
};
