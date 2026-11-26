import { randomUUID } from "crypto";
import { getPost } from "./postService.js";
import {
  getCommentsByPostId,
  saveComment,
} from "../repositories/commentRepository.js";

export const getComments = async (postId) => {
  await getPost(postId);
  return getCommentsByPostId(postId);
};

export const createComment = async ({ postId, username, content }) => {
  await getPost(postId);

  const comment = {
    id: randomUUID(),
    postId,
    username,
    content,
    createdAt: new Date().toISOString(),
  };

  await saveComment(comment);
  return comment;
};
