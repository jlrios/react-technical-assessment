const BASE_URL = "https://dummyjson.com";

import type { PostsResponse } from "../types/post";

export const getPosts = async (): Promise<PostsResponse> => {  const response = await fetch(`${BASE_URL}/posts`);
  if (!response.ok) {
    throw new Error("Error al obtener las publicaciones.");
  }

  return response.json();
};

export const createPost = async (post: {
  title: string;
  body: string;
}) => {

  const response = await fetch("https://dummyjson.com/posts/add", {

    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      title: post.title,
      body: post.body,
      userId: 1,
    }),
  });

  if (!response.ok) {
    throw new Error("Error al crear la publicación.");
  }

  return response.json();
};

export const updatePost = async (
  id: number,
  post: {
    title: string;
    body: string;
  }
) => {

  const response = await fetch(
    `https://dummyjson.com/posts/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(post),
    }
  );

  if (!response.ok) {
    throw new Error("Error al actualizar.");
  }

  return response.json();
};