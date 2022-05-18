const Post = require("../models/post");
const Account = require("../models/account");
const PostCollection = require("../models/postcollection");
const createError = require("http-errors");

// Handle Post create.
exports.post_create = async function (req, res, next) {
  try {
    const postdetail = {
      title,
      tags,
      cooking_time,
      prep_time,
      calories,
      servings,
      ingredients,
      instructions,
      summary,
    } = req.body;

    postdetail.author = req.user;

    const result = await Post.create(postdetail);

    res.send(result);
  } catch (error) {
    next(createError(error.status ?? 500, error));
  }
};

// Display list of all Post.
exports.post_list = async function (req, res) {
  const username = req.query.username ?? "";

  const account = await Account.findOne(
    { username: username },
    "_id"
  ).lean();
  const query = account ? { author: account._id } : {};

  let posts = await Post.find(
    query,
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
        // Not Found
        next();
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

// Handle Post update.
exports.post_update = async function (req, res, next) {
  try {
    const { id } = req.params;
    const {
      calories,
      cooking_time,
      prep_time,
      servings,
      ingredients,
      instructions,
      summary,
      tags,
      title,
    } = req.body;

    const result = await Post.findOneAndUpdate(
      {
        _id: id,
        author: req.user,
      },
      {
        title,
        tags,
        cooking_time,
        prep_time,
        calories,
        servings,
        ingredients,
        instructions,
        summary,
      },
      { new: true, runValidators: true }
    );
    res.send(result);
  } catch (error) {
    next(createError(error.status ?? 500, error));
  }
};

exports.post_delete = async function (req, res, next) {
  try {
    const { id } = req.params;

    const result = await Post.findOneAndDelete({ _id: id, author: req.user });

    res.status(200).send({ success: 1 });
  } catch (error) {
    next(createError(error.status ?? 500, error));
  }
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
