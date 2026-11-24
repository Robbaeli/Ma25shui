import { randomUUID } from "crypto";
import { createError } from "@middy/util";
import {
  getAllPosts,
  getPostById,
  savePost,
} from "../repositories/postRepository.js";

export const getPosts = async (username) => {
  const posts = await getAllPosts();

  const filtered = username
    ? posts.filter((post) => post.username === username)
    : posts;

  return filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

export const getPost = async (postId) => {
  const post = await getPostById(postId);
  if (!post) throw createError(404, "Post not found");
  return post;
};

export const createPost = async ({ username, title, content }) => {
  const now = new Date().toISOString();

  const post = {
    id: randomUUID(),
    username,
    isGuest: false,
    title,
    content,
    createdAt: now,
    updatedAt: now,
  };

  await savePost(post);
  return post;
};
