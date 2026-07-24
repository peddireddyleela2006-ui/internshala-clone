const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
            required: true,
        },
        userPhoto: {
            type: String,
            default: "",
        },
        comment: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: true }
);

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },

        userName: {
            type: String,
            required: true,
        },
        userPhoto: {
            type: String,
            default: "",
        },
        caption: {
            type: String,
            default: "",
        },

        mediaUrl: {
            type: String,
            default: "",
        },

        mediaType: {
            type: String,
            enum: ["image", "video", ""],
            default: "",
        },

        likes: [
            {
                type: String,
            },
        ],

        comments: [commentSchema],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Post", postSchema);