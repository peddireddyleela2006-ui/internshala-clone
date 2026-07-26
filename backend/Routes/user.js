const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../Model/User");

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, provider } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    if (provider !== "google") {
      if (!phone || !password) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }
    }

    let existingUser = null;

    if (provider === "google") {
      existingUser = await User.findOne({ email });
    } else {
      existingUser = await User.findOne({
        $or: [{ email }, { phone }],
      });
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    let hashedPassword = "";

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      firebaseUid: req.body.firebaseUid,
      photo: req.body.photo || "",

      subscription: {
        plan: "Free",
        applicationsAllowed: 1,
        applicationsUsed: 0,
        expiryDate: null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
router.post("/sync", async (req, res) => {

  try {

    user = await User.create({
      name,
      email,
      firebaseUid,
      photo,

      subscription: {
        plan: "Free",
        applicationsAllowed: 1,
        applicationsUsed: 0,
        expiryDate: null,
      },
    });


    let user = await User.findOne({
      firebaseUid
    });


    if (!user) {

      user = await User.create({

        name,
        email,
        firebaseUid,
        photo

      });

    }


    res.status(200).json({
      success: true,
      user
    });


  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }

});
router.get("/email/:email", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.params.email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
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