import { db } from "../database.js";

export const newBlog = (id, title, content, user_id, datetime) => {
  return {
    id,
    title,
    content,
    user_id,
    datetime,
  };
};

export const newBlogsUser = (
  blog_id,
  blog_title,
  blog_content,
  blog_user_id,
  blog_datetime,
  user_id,
  user_first_name,
  user_last_name,
  user_email,
  user_password,
  user_phone,
  user_role,
  user_profile_img,
  user_authentication_key
) => {
  return {
    blog_id,
    blog_title,
    blog_content,
    blog_user_id,
    blog_datetime,
    user_id,
    user_first_name,
    user_last_name,
    user_email,
    user_password,
    user_phone,
    user_role,
    user_profile_img,
    user_authentication_key,
  };
};

export const getAll = async () => {
  const [allBlogResults] = await db.query("SELECT * FROM blogs");

  return await allBlogResults.map((blogResult) => {
    return newBlog(
      blogResult.blog_id.toString(),
      blogResult.blog_title,
      blogResult.blog_content,
      blogResult.blog_user_id,
      blogResult.blog_datetime
    );
  });
};

export const getAllBlogDetails = async () => {
  const [allBlogDetailsResults] = await db.query(
    `SELECT * FROM blogs INNER JOIN users ON blogs.blog_user_id = users.user_id`
  );

  return await allBlogDetailsResults.map((blogDetailsResult) => {
    return newBlogsUser(
      blogDetailsResult.blog_id,
      blogDetailsResult.blog_title,
      blogDetailsResult.blog_content,
      blogDetailsResult.blog_user_id,
      blogDetailsResult.blog_datetime,
      blogDetailsResult.user_id,
      blogDetailsResult.user_first_name,
      blogDetailsResult.user_last_name,
      blogDetailsResult.user_email,
      blogDetailsResult.user_password,
      blogDetailsResult.user_phone,
      blogDetailsResult.user_role,
      blogDetailsResult.user_profile_img,
      blogDetailsResult.user_authentication_key
    );
  });
};

export const getByID = async (blogID) => {
  const [blogResults] = await db.query(
    "SELECT * FROM blogs WHERE blog_id = ?",
    blogID
  );

  if (blogResults.length > 0) {
    const blogResult = blogResults[0];
    return Promise.resolve(
      newBlog(
        blogResult.blog_id.toString(),
        blogResult.blog_title,
        blogResult.blog_content,
        blogResult.blog_user_id,
        blogResult.blog_datetime
      )
    );
  } else {
    return Promise.reject("No results found");
  }
};

export const create = async (blog) => {
  delete blog.id;

  return db
    .query(
      `INSERT INTO blogs (blog_title, blog_content, blog_user_id, blog_datetime) VALUE (?, ?, ?, ?)`,
      [blog.title, blog.content, blog.user_id, blog.datetime]
    )
    .then(([result]) => {
      return { ...blog, id: result.insertId };
    });
};

export const update = async (blog) => {
  return db
    .query(
      `
    UPDATE blogs SET
      blog_title = ?,
      blog_content = ?,
      blog_user_id = ?,
      blog_datetime = ?
    WHERE blog_id = ?`,
      [blog.title, blog.content, blog.user_id, blog.datetime, blog.id]
    )
    .then(([result]) => {
      return { ...blog, id: result.insertId };
    });
};

export const deleteByID = async (blogID) => {
  return db.query(`DELETE FROM blogs WHERE blog_id = ?`, [blogID]);
};
