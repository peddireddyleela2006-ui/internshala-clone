const express = require("express");
const router = express.Router();

const Resume = require("../Model/Resume");
const User = require("../Model/User");


// Create Resume
router.post("/create", async (req, res) => {
  try {
    const {
      userId,
      name,
      email,
      phone,
      education,
      skills,
      experience,
      about,
      photo,
    } = req.body;


    // Check user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    // Create resume
    const resume = await Resume.create({
      userId,
      name,
      email,
      phone,
      education,
      skills,
      experience,
      about,
      photo,
    });


    // Attach resume to user
    user.resumeId = resume._id;
    await user.save();


    res.status(201).json({
      success: true,
      message: "Resume created successfully",
      resume,
    });


  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
router.get("/:userId", async (req, res) => {
  try {
    const resume = await Resume.findOne({
      userId: req.params.userId,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.json({
      success: true,
      resume,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
router.put("/:userId", async (req, res) => {
  try {
    const updatedResume = await Resume.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true }
    );

    if (!updatedResume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.json({
      success: true,
      resume: updatedResume,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
module.exports = router;