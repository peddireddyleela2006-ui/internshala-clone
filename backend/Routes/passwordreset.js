const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");

const User = require("../Model/User");
const PasswordReset = require("../Model/PasswordReset");
const resend = require("../config/resend");

function generatePassword(length = 10) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  let password = "";

  for (let i = 0; i < length; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return password;
}

router.post("/request", async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: "Email or phone is required",
      });
    }


    const user = await User.findOne({
      $or: [
        { email: identifier },
        { phone: identifier }
      ]
    });
    const email = user.email;
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    
    const previousReset = await PasswordReset.findOne({
      email,
    });


    if (previousReset) {
      const today = new Date();
      const lastReset = new Date(previousReset.resetAt);


      const difference =
        today - lastReset;


      const oneDay = 24 * 60 * 60 * 1000;


      if (difference < oneDay) {
        return res.status(400).json({
          success: false,
          message:
            "You can use this option only once per day.",
        });
      }
    }


    const newPassword = generatePassword();

    const hashedPassword = await bcrypt.hash(newPassword, 10);


    user.password = hashedPassword;
    user.lastPasswordReset = new Date();

    await user.save();


    await PasswordReset.create({
      email,
      resetAt: new Date(),
    });


    const mailResponse = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Password Reset",
      html: `
    <h3>Your password has been reset</h3>
    <p>Your new password is:</p>
    <h2>${newPassword}</h2>
  `,
    });

    console.log("RESEND RESPONSE:", mailResponse);


    return res.json({
      success: true,
      message: "Password reset successfully. Check your email.",
    });


  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
});
router.get("/test", (req, res) => {
  res.send("Password reset route working");
});

module.exports = router;