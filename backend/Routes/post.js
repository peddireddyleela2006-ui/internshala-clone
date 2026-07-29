const express = require("express");
const router = express.Router();

const Post = require("../Model/Post");
const User = require("../Model/User");
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/upload");
const streamifier = require("streamifier");

router.post(
    "/create",
    upload.single("media"),
    async (req, res) => {
        try {
            const {
                userId,
                userName,
                userPhoto,
                caption,
            } = req.body;
            
            if (!userId || !userName) {
                return res.status(400).json({
                    success: false,
                    message: "userId and userName are required",
                });
            }
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            const friendCount = user.friends?.length || 0;

            if (friendCount === 0) {
                return res.status(403).json({
                    success: false,
                    message: "You need at least one friend to post.",
                });
            }

            if (friendCount <= 10) {

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const postsToday = await Post.countDocuments({
                    userId,
                    createdAt: {
                        $gte: today,
                    },
                });

                if (postsToday >= friendCount) {
                    return res.status(403).json({
                        success: false,
                        message: `Daily limit reached. You can post only ${friendCount} time(s) today.`,
                    });
                }
            }
            if (!userId || !userName) {
                return res.status(400).json({
                    success: false,
                    message: "userId and userName are required",
                });
            }

            let mediaUrl = "";
            let mediaType = "";

            if (req.file) {
                const uploadResult = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            folder: "public-space",
                            resource_type: "auto",
                        },
                        (error, result) => {
                            if (error) return reject(error);
                            resolve(result);
                        }
                    );

                    streamifier.createReadStream(req.file.buffer).pipe(stream);
                });

                mediaUrl = uploadResult.secure_url;

                if (req.file.mimetype.startsWith("image")) {
                    mediaType = "image";
                } else if (req.file.mimetype.startsWith("video")) {
                    mediaType = "video";
                }
            }

            const newPost = new Post({
                userId,
                userName,
                userPhoto,
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
                message: err.message,
            });
        }
    }
);



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

router.put("/like/:id", async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required",
            });
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        const alreadyLiked = post.likes.includes(userId);

        if (alreadyLiked) {
            post.likes = post.likes.filter((id) => id !== userId);

            await post.save();

            return res.status(200).json({
                success: true,
                message: "Post unliked",
                totalLikes: post.likes.length,
            });
        }

        post.likes.push(userId);

        await post.save();

        res.status(200).json({
            success: true,
            message: "Post liked",
            totalLikes: post.likes.length,
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
});

router.post("/comment/:id", async (req, res) => {
    try {
        const {
            userId,
            userName,
            userPhoto,
            comment
        } = req.body;

        if (!userId || !userName || !comment) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        post.comments.push({
            userId,
            userName,
            userPhoto,
            comment,
        });

        await post.save();

        res.status(200).json({
            success: true,
            message: "Comment added successfully",
            comments: post.comments,
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
});

router.get("/comments/:id", async (req, res) => {
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
            comments: post.comments,
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