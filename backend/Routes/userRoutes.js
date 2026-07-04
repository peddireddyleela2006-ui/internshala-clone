const express = require("express");
const router = express.Router();

const User = require("../Model/User");

router.post("/register", async (req, res) => {
  try {
    const { uid, name, email, phone } = req.body;

    if (!uid || !name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists.",
      });
    }

    await User.create({
      uid,
      name,
      email,
      phone,
    });

    return res.json({
      success: true,
      message: "User profile saved successfully.",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;