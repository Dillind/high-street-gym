import { Router } from "express";
import * as Blogs from "../models/blogs.js";
import auth from "../middleware/auth.js";
import validator from "validator";

const blogController = Router();

blogController.get("/", async (req, res) => {
  const blogs = await Blogs.getAll();

  if (!blogs) {
    res.status(404).json({
      status: 404,
      message: "Failed to retrieve all blog posts",
    });
  } else {
    res.status(200).json({
      status: 200,
      message: "Successfully retrieved all blog posts",
      blogs,
    });
  }
});

blogController.get("/details", async (req, res) => {
  const blogs = await Blogs.getAllBlogDetails();

  if (!blogs) {
    res.status(404).json({
      status: 404,
      message: "Failed to retrieve all the detailed blog posts",
    });
  } else {
    res.status(200).json({
      status: 200,
      message: "Successfully retrieved all the detailed blog posts",
      blogs,
    });
  }
});

blogController.get("/:id", async (req, res) => {
  const blogID = req.params.id;

  if (isNaN(blogID) || blogID <= 0) {
    return res.status(400).json({
      status: 400,
      message: "Invalid blog post ID",
    });
  }

  Blogs.getByID(blogID)
    .then((blog) => {
      res.status(200).json({
        status: 200,
        message: "Successfully retrieved blog post by ID",
        blog,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Failed to retrieve blog post by ID",
      });
    });
});

blogController.post("/", async (req, res) => {
  const blogData = req.body;

  // Data format validation
  if (!/^[A-Za-z0-9 \-!',.:]{1,30}$/.test(blogData.title)) {
    return res.status(422).json({
      status: 422,
      message: `Invalid format. Please use only letters, numbers, spaces, hyphens and apostrophes, and
      exclamation marks, with a maximum length of 30 characters.`,
    });
  }

  if (!/^[A-Za-z0-9 \-!',.:]{1,200}$/.test(blogData.content)) {
    return res.status(422).json({
      status: 422,
      message: `Invalid format. Please use only letters, numbers, spaces, hyphens, apostrophes, 
      and exclamation marks, with a maximum length of 200 characters.`,
    });
  }

  if (!/^\d+$/.test(blogData.user_id)) {
    return res.status(422).json({
      status: 422,
      message: "Invalid format. Must be a non-negative integer.",
    });
  }

  // Convert blog data into a Blogs model object
  const blog = Blogs.newBlog(
    null,
    validator.escape(blogData.title),
    validator.escape(blogData.content),
    blogData.user_id,
    new Date()
  );

  // Use the create model function to insert the blog post into the database
  Blogs.create(blog)
    .then((blog) => {
      res.status(200).json({
        status: 200,
        message: "Successfully created new blog post",
        blog,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: "Failed to create new blog post",
      });
    });
});

blogController.patch("/:id", async (req, res) => {
  const blogID = req.params.id;
  const blogData = req.body;

  // Data format validation
  if (!/^[A-Za-z0-9 \-!',.]{1,30}$/.test(blogData.title)) {
    return res.status(422).json({
      status: 422,
      message: `Invalid format. Please use only letters, numbers, spaces, hyphens and apostrophes, and
      exclamation marks, with a maximum length of 30 characters.`,
    });
  }

  if (!/^[A-Za-z0-9 \-!',.]{1,200}$/.test(blogData.content)) {
    return res.status(422).json({
      status: 422,
      message: `Invalid format. Please use only letters, numbers, spaces, hyphens, apostrophes, 
      and exclamation marks, with a maximum length of 200 characters.`,
    });
  }

  if (!/^\d+$/.test(blogData.user_id)) {
    return res.status(422).json({
      status: 422,
      message: "Invalid format. Must be a non-negative integer.",
    });
  }

  if (isNaN(blogID) || blogID <= 0) {
    return res.status(400).json({
      status: 400,
      message: "Invalid blog post ID",
    });
  }

  try {
    const existingBlog = await Blogs.getByID(blogID);

    if (!existingBlog) {
      return res.status(404).json({
        status: 404,
        message: "Blog post with that ID not found",
      });
    }

    blogData.id = blogID;

    const blog = Blogs.newBlog(
      blogData.id,
      validator.escape(blogData.title),
      validator.escape(blogData.content),
      blogData.user_id,
      blogData.datetime
    );

    const updatedBlog = await Blogs.update(blog);

    if (updatedBlog) {
      res.status(200).json({
        status: 200,
        message: "Successfully updated the blog post",
        blog: updatedBlog,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Failed to update the blog post",
    });
  }
});

blogController.delete("/:id", async (req, res) => {
  const blogID = req.params.id;

  if (isNaN(blogID) || blogID <= 0) {
    return res.status(400).json({
      status: 400,
      message: "Invalid blog post ID",
    });
  }

  try {
    const blogToDelete = await Blogs.getByID(blogID);

    if (!blogToDelete) {
      res.status(404).json({
        status: 404,
        message: "Blog post was not found with that ID",
      });
    }

    await Blogs.deleteByID(blogID);

    res.status(200).json({
      status: 200,
      message: "Successfully deleted the blog post",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Failed to delete the blog post",
    });
  }
});

export default blogController;
