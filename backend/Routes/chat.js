const express = require("express");
const router = express.Router();

const Chat = require("../Model/Chat");
const User = require("../Model/User");


router.post("/send", async (req, res) => {
    try {

        const { senderId, receiverId, message } = req.body;

        if (!senderId || !receiverId || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const chat = new Chat({
            sender: senderId,
            receiver: receiverId,
            message
        });

        await chat.save();

        res.status(201).json({
            success: true,
            message: "Message sent",
            chat
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});

router.get("/:user1/:user2", async (req, res) => {
    try {

        const { user1, user2 } = req.params;

        const chats = await Chat.find({
            $or: [
                {
                    sender: user1,
                    receiver: user2
                },
                {
                    sender: user2,
                    receiver: user1
                }
            ]
        })
        .sort({ createdAt: 1 })
        .populate("sender", "name")
        .populate("receiver", "name");

        res.status(200).json({
            success: true,
            chats
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
});
module.exports = router;