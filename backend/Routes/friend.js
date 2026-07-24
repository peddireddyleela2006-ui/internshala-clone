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
        success:false,
        message:"Friend request not found"
      });
    }


    const senderUser = await User.findById(request.sender);
    const receiverUser = await User.findById(request.receiver);


    if (!senderUser || !receiverUser) {
      return res.status(404).json({
        success:false,
        message:"Users not found"
      });
    }


    // prevent duplicate friends
    if (!senderUser.friends.includes(receiverUser._id)) {
      senderUser.friends.push(receiverUser._id);
    }

    if (!receiverUser.friends.includes(senderUser._id)) {
      receiverUser.friends.push(senderUser._id);
    }


    await senderUser.save();
    await receiverUser.save();


    request.status = "accepted";
    await request.save();


    res.json({
      success:true,
      message:"Friend request accepted"
    });


  } catch(err){

    console.log(err);

    res.status(500).json({
      success:false,
      message:err.message
    });

  }
});
// =========================
// Reject Friend Request
// =========================

router.delete("/reject/:requestId", async (req, res) => {
    ``

    try {

        const { requestId } = req.params;

        const request = await FriendRequest.findById(requestId);


        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Friend request not found"
            });
        }


        await FriendRequest.findByIdAndDelete(requestId);


        res.status(200).json({
            success: true,
            message: "Friend request rejected"
        });


    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});
// Get Friends List
router.get("/list/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .populate("friends", "name email");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.json({
            success: true,
            friends: user.friends,
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
});
// Get all users
router.get("/users/:userId", async (req,res)=>{
    try{

        const users = await User.find({
            _id:{
                $ne:req.params.userId
            }
        }).select("name email friends");


        res.json({
            success:true,
            users
        });


    }catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });

    }
});
router.put("/remove/:userId/:friendId", async(req,res)=>{

try{

const user = await User.findById(req.params.userId);
const friend = await User.findById(req.params.friendId);


user.friends = user.friends.filter(
(id)=>id.toString() !== friend._id.toString()
);


friend.friends = friend.friends.filter(
(id)=>id.toString() !== user._id.toString()
);


await user.save();
await friend.save();


res.json({
 success:true,
 message:"Friend removed"
});


}catch(err){

res.status(500).json({
success:false,
message:err.message
});

}

});
module.exports = router;