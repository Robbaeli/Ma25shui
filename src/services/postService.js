import { createError } from "@middy/util";
import { getAllPosts, getPostById } from "../repositories/postRepository.js";

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
