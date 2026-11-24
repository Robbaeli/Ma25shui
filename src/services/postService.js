import { randomUUID } from "crypto";
import { createError } from "@middy/util";
import {
  getAllPosts,
  getPostById,
  savePost,
  deletePostById,
} from "../repositories/postRepository.js";
import { generateGuestName } from "../utils/guestName.js";

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

export const createPost = async ({ user, title, content }) => {
  const now = new Date().toISOString();
  const isGuest = !user;

  const post = {
    id: randomUUID(),
    username: isGuest ? generateGuestName() : user.username,
    isGuest,
    title,
    content,
    createdAt: now,
    updatedAt: now,
  };

  await savePost(post);
  return post;
};

const getOwnedPost = async (postId, username) => {
  const post = await getPost(postId);

  if (post.isGuest || post.username !== username) {
    throw createError(403, "You are not allowed to modify this post");
  }

  return post;
};

export const updatePost = async ({ postId, username, title, content }) => {
  const post = await getOwnedPost(postId, username);

  const updatedPost = {
    ...post,
    title,
    content,
    updatedAt: new Date().toISOString(),
  };

  await savePost(updatedPost);
  return updatedPost;
};

export const deletePost = async ({ postId, username }) => {
  await getOwnedPost(postId, username);
  await deletePostById(postId);
};
