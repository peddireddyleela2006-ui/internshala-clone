const express = require("express");
const router = express.Router();

const User = require("../Model/User");
const FriendRequest = require("../Model/FriendRequest");
router.post("/send-request", async (req, res) => {
    try {

        const { senderId, receiverId } = req.body;

        if (!senderId || !receiverId) {
            return res.status(400).json({
                success: false,
                message: "Both user IDs are required",
            });
        }

        if (senderId === receiverId) {
            return res.status(400).json({
                success: false,
                message: "You cannot send a request to yourself",
            });
        }

        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const existing = await FriendRequest.findOne({
            sender: senderId,
            receiver: receiverId,
            status: "pending",
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Friend request already sent",
            });
        }

        const request = new FriendRequest({
            sender: senderId,
            receiver: receiverId,
        });

        await request.save();

        res.status(201).json({
            success: true,
            message: "Friend request sent",
            request,
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
// Get Incoming Friend Requests
// =========================

// =========================
// Get Incoming Friend Requests
// =========================

router.get("/requests/:userId", async (req, res) => {
    try {

        const requests = await FriendRequest.find({
    receiver: req.params.userId,
    status: "pending",
}).populate("sender", "name email");

        res.status(200).json({
            success: true,
            requests,
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});
// =========================
// Accept Friend Request
// =========================

router.put("/accept/:requestId", async (req, res) => {

    try {

        const { requestId } = req.params;


        const request = await FriendRequest.findById(requestId);


        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Friend request not found",
            });
        }


        const sender = await User.findById(request.sender);
        const receiver = await User.findById(request.receiver);


        if (!sender || !receiver) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }


        // Add each other as friends

        if (!sender.friends.includes(receiver._id)) {
            sender.friends.push(receiver._id);
        }


        if (!receiver.friends.includes(sender._id)) {
            receiver.friends.push(sender._id);
        }


        await sender.save();
        await receiver.save();


        // update request status

        request.status = "accepted";

        await request.save();


        res.status(200).json({
            success: true,
            message: "Friend request accepted",
        });


    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message,
        });

    }

});
module.exports = router;