const express = require("express");
const router = express.Router();

const Post = require("../Model/Post");


// =========================
// Create Post
// =========================
router.post("/create", async (req, res) => {
  try {
    const { userId, userName, caption, mediaUrl, mediaType } = req.body;

    if (!userId || !userName) {
      return res.status(400).json({
        success: false,
        message: "userId and userName are required",
      });
    }

    const newPost = new Post({
      userId,
      userName,
      caption,
      mediaUrl,
      mediaType,
    });

    await newPost.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});


// =========================
// Get All Posts
// =========================
router.get("/", async (req, res) => {
  try {

    const posts = await Post.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      posts,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});


// =========================
// Get Single Post
// =========================
router.get("/:id", async (req, res) => {

  try {

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      post,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }

});


// =========================
// Delete Post
// =========================
router.delete("/:id", async (req, res) => {

  try {

    const deletedPost = await Post.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }

});

module.exports = router;