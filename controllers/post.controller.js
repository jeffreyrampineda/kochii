const Post = require("../models/post");
const createError = require("http-errors");

// Display list of all Post.
exports.post_list = async function (req, res) {
  const posts = await Post.find(
    {},
    "title tags createdAt summary banner likes dislikes"
  ).sort({ createdAt: -1, title: 1 });

  res.render("blog/post_list", { title: "Blog | Kochii", posts });
};

// Display detail page for a specific Post.
exports.post_detail = async function (req, res, next) {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "firstName lastName"
    );

    if (!post) {
      res.render("message", {
        title: "Page Not Found | Kochii",
        message_title: "( ._.)",
        message_subtitle: "404 Not Found",
        message_description: "Sorry but the requested page is not found!",
      });
    } else {
      res.render("blog/post_detail", {
        title: post.title + " | Blog",
        post,
      });
    }
  } catch (error) {
    next(createError(error.status ?? 500, error));
  }
};

// Display Post create form on GET.
exports.post_create_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Post create GET");
};

// Handle Post create on POST.
exports.post_create_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Post create POST");
};

// Display Post delete form on GET.
exports.post_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Post delete GET");
};

// Handle Post delete on POST.
exports.post_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Post delete POST");
};

// Display Post update form on GET.
exports.post_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Post update GET");
};

// Handle Post update on POST.
exports.post_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Post update POST");
};
