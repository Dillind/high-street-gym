import BottomNav from "../../common/BottomNav";
import MemberNavBar from "../../common/MemberNavBar";
import * as Blogs from "../../api/blogs.js";
import { useEffect, useState } from "react";
import { useAuthentication } from "../authentication.jsx";

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthentication();
  const [statusMessage, setStatusMessage] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    content: "",
    user_id: 0,
    date_time: new Date(),
  });

  useEffect(() => {
    const fetchAllBlogPosts = async () => {
      try {
        const response = await Blogs.getAllBlogDetails();
        const sortedBlogPosts = response.sort(
          (a, b) => new Date(b.blog_datetime) - new Date(a.blog_datetime)
        );
        setBlogPosts(sortedBlogPosts);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchAllBlogPosts();
  }, []);

  if (!user) {
    return <span className="loading loading-spinner loading-md"></span>;
  }

  const handleDeletePost = async (blogID, authenticationKey) => {
    // checks to see if the user exists and the user deleting the blog post is an admin.
    if (user && user.role === "admin") {
      try {
        await Blogs.deleteByID(blogID, authenticationKey);
        // filters through the posts and if the blog_id of the post matches the blogID of the post
        // to be deleted, it is removed from the blogPosts array.
        const updatedBlogPosts = blogPosts.filter(
          (post) => post.blog_id !== blogID
        );
        setBlogPosts(updatedBlogPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const convertToDate = (classDateTime) => {
    const date = new Date(classDateTime);
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      timeZone: "Australia/Brisbane",
    };
    const dayOfTheWeek = date
      .toLocaleDateString("en-AU", options)
      .replace(/,/g, " - ");

    return dayOfTheWeek;
  };

  const formatFirstName = (userFirstName) => {
    return userFirstName.substring(0, 1).toUpperCase();
  };

  const resetForm = () => {
    setFormData({
      id: "",
      title: "",
      content: "",
      user_id: 0,
      date_time: new Date(),
    });
    setStatusMessage("");
  };

  const handleCloseModal = () => {
    document.getElementById("modal").close();
    resetForm();
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const userID = user.id;
    const updatedFormData = { ...formData, user_id: userID };
    // Set the updated formData
    setFormData(updatedFormData);
    setStatusMessage("Creating post...");

    // Title Validation
    if (!/^[A-Za-z0-9 \-!',.:]{1,30}$/.test(updatedFormData.title)) {
      setStatusMessage(
        `Invalid title name. Please use only letters, numbers, spaces, hyphens and apostrophes, and
        exclamation marks, with a maximum length of 30 characters.`
      );
      return;
    }

    // Content Validation
    if (!/^[A-Za-z0-9 \-!',.:]{1,200}$/.test(updatedFormData.content)) {
      setStatusMessage(
        `Invalid content. Please use only letters, numbers, spaces, hyphens, apostrophes, 
        and exclamation marks, with a maximum length of 200 characters.`
      );
    }

    try {
      const result = await Blogs.create(updatedFormData);
      if (result) {
        setStatusMessage(result.message);
        // Fetch all blog posts again after successful creation
        const updatedBlogPosts = await Blogs.getAllBlogDetails();
        // Sorts the blog posts in descending order (most recent to oldest)
        const sortedBlogPosts = updatedBlogPosts.sort(
          (a, b) => new Date(b.blog_datetime) - new Date(a.blog_datetime)
        );
        setBlogPosts(sortedBlogPosts);
        handleCloseModal();
        return result;
      }
    } catch (error) {
      console.log(error);
      setStatusMessage(`Creating post failed: ${error}`);
    }
  };

  return (
    <main className="max-container">
      <MemberNavBar />
      <h1
        className="text-[33px] font-palanquin font-semibold text-center uppercase tracking-normal 
      my-2"
      >
        Blogs
      </h1>
      <section className="relative shadow-md">
        <button
          className="mb-3 ml-3 btn btn-primary"
          onClick={() => document.getElementById("modal").showModal()}
        >
          <span className="font-montserrat">Create Post</span>
        </button>
        <dialog id="modal" className="modal">
          <div className="modal-box">
            <h2 className="text-2xl font-bold text-center font-palanquin">
              Create Post
            </h2>
            <form onSubmit={handleCreatePost}>
              <button
                className="absolute btn btn-sm btn-circle btn-ghost right-2 top-2"
                onClick={handleCloseModal}
                type="button"
              >
                ✕
              </button>
              {/* Title */}
              <div>
                <label htmlFor="title" className="label">
                  <span className="font-montserrat">Title:</span>
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Title"
                  className="w-full input input-bordered font-montserrat"
                  value={formData.title}
                  maxLength={30}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              {/* Content */}
              <div>
                <label htmlFor="content" className="label">
                  <span className="font-montserrat">Content:</span>
                </label>
                <textarea
                  name="content"
                  id="content"
                  placeholder={`What's on your mind, ${user.first_name}?`}
                  className="w-full p-3 border rounded-md resize-none focus:ring focus:outline-none focus:ring-gray-200 focus:ring-offset-2 font-montserrat focus:outline-2"
                  rows={6}
                  maxLength={200}
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  required
                />
              </div>
              <span className="text-xs label-text-alt font-montserrat">
                {statusMessage}
              </span>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="mt-2 btn btn-primary font-montserrat"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </section>
      <section className="pb-[3.5rem] max-h-[75vh] overflow-y-auto">
        {loading ? (
          <span className="loading loading-spinner loading-md"></span>
        ) : (
          <div>
            {blogPosts && blogPosts.length > 0 ? (
              blogPosts.map((blogPost) => (
                <article
                  key={blogPost.blog_id}
                  className="p-2 mb-4 border-b-2 border-gray-300 border-dashed m-2"
                >
                  <div className="flex items-center gap-1">
                    <div className="avatar placeholder">
                      <div className="w-8 rounded-full bg-neutral text-neutral-content">
                        <span className="text-lg">
                          {formatFirstName(blogPost.user_first_name)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium font-montserrat">
                        {blogPost.user_first_name}
                      </span>
                      <span className="font-montserrat text-[10px] capitalize text-gray-500">
                        {blogPost.user_role}
                      </span>
                    </div>
                    <div className="ml-auto">
                      {user && user.role === "admin" ? (
                        <button
                          className="btn font-montserrat btn-secondary"
                          onClick={() =>
                            handleDeletePost(
                              blogPost.blog_id,
                              blogPost.user_authentication_key
                            )
                          }
                        >
                          Delete
                        </button>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col p-2">
                    <p className="text-lg font-bold font-montserrat">
                      {blogPost.blog_title}
                    </p>
                    <span className="font-montserrat text-[10px]">
                      {convertToDate(blogPost.blog_datetime)}
                    </span>
                  </div>

                  <p className="p-2 text-sm font-montserrat">
                    {blogPost.blog_content}
                  </p>
                </article>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 mt-5">
                <span className="font-montserrat">No blogs found.</span>
                <div className="flex gap-2 mt-5">
                  <button
                    className="px-10 btn btn-secondary font-montserrat"
                    onClick={() => window.history.back()}
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
      <BottomNav />
    </main>
  );
};

export default BlogPage;
