import { API_URL } from "./api";

export const getAll = async () => {
  const response = await fetch(API_URL + "/blogs/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();
  return APIResponseObject.blogs;
};

export const getAllBlogDetails = async () => {
  const response = await fetch(API_URL + "/blogs/details", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();
  return APIResponseObject.blogs;
};

export const getByID = async (blogID) => {
  const response = await fetch(API_URL + "/blogs/" + blogID, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const APIResponseObject = await response.json();

  return APIResponseObject.blog;
};

export const create = async (blog, authenticationKey) => {
  const response = await fetch(API_URL + "/blogs/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-KEY": authenticationKey,
    },
    body: JSON.stringify(blog),
  });

  const postCreateBlogResponse = await response.json();

  return postCreateBlogResponse;
};

export const update = async (blog, authenticationKey) => {
  const response = await fetch(API_URL + "/blogs/" + blog.id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-KEY": authenticationKey,
    },
    body: JSON.stringify(blog),
  });

  const patchBlogResponse = await response.json();

  return patchBlogResponse;
};

export const deleteByID = async (blogID, authenticationKey) => {
  const response = await fetch(API_URL + "/blogs/" + blogID, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-KEY": authenticationKey,
    },
    body: JSON.stringify({}),
  });

  const deleteBlogResponse = await response.json();

  return deleteBlogResponse;
};
