const Post = require("../models/post");
const PostCollection = require("../models/postcollection");
const createError = require("http-errors");

// Display list of all Post.
exports.post_list = async function (req, res) {
  let posts = await Post.find(
    {},
    "title tags createdAt summary banner likes dislikes"
  ).sort({ createdAt: -1, title: 1 });
  if (!req.accepts("html")) {
    // If does not expect html, return json.
    posts = posts.map((post) => post.toObject()); // Makes image a base64
    res.send(posts);
  } else {
    res.render("recipes/post_list", { title: "Recipes | Kochii", posts });
  }
};

// Display detail page for a specific Post.
exports.post_detail = async function (req, res, next) {
  try {
    let post = await Post.findById(req.params.id).populate(
      "author",
      "firstName lastName"
    );

    if (!req.accepts("html")) {
      // If does not expect html, return json.
      post = post.toObject(); // Allows adding properties, makes image a base64.
      // If using /api/recipes/detail route, check if post is saved in collection.
      if (req.user) {
        const isSaved = await PostCollection.findOne(
          {
            owner: req.user,
            posts: {
              _id: req.params.id,
            },
          },
          "posts"
        ).lean();
        if (post && isSaved) {
          post.saved = isSaved.posts ? true : false;
        }
      }
      res.send(post);
    } else {
      if (!post) {
        res.render("message", {
          title: "Page Not Found | Kochii",
          message_title: "( ._.)",
          message_subtitle: "404 Not Found",
          message_description: "Sorry but the requested page is not found!",
        });
      } else {
        res.render("recipes/post_detail", {
          title: post.title + " | Recipes",
          post,
        });
      }
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

/// PROTECTED ROUTES ///

// Display list of all PostCollection of the req.user.
exports.postcollection_get = async function (req, res, next) {
  try {
    const postcollection = await PostCollection.findOne({
      owner: req.user,
    })
      .populate("posts")
      .lean(); // Lean makes image a base64.
    res.send(postcollection);
  } catch (error) {
    next(createError(error.status ?? 500, error));
  }
};

// Handle PostCollection create.
exports.postcollection_create = async function (req, res, next) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw { status: 400, error_messages: ["Post not found"] };
    }

    const result = await PostCollection.findOneAndUpdate(
      { owner: req.user },
      { $push: { posts: post } },
      {
        new: true,
        runValidators: true,
        upsert: true,
      }
    );
    res.send(result);
  } catch (error) {
    next(createError(error.status ?? 500, error));
  }
};

// Handle PostCollection delete.
exports.postcollection_delete = async function (req, res, next) {
  try {
    const result = await PostCollection.findOneAndUpdate(
      { owner: req.user },
      {
        // Remove post {id} from posts array
        $pull: { posts: req.params.id },
      },
      {
        new: true,
      }
    ).lean();
    res.send(result);
  } catch (error) {
    next(createError(error.status ?? 500, error));
  }
};
