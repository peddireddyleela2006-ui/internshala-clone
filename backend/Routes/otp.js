const express = require("express");
const router = express.Router();
const transporter = require("../config/transporter");
const Otp = require("../Model/Otp");

router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // OTP expires in 5 minutes
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Remove any previous OTP for this email
    await Otp.deleteMany({ email });

    // Save the new OTP
    await Otp.create({
      email,
      otp,
      expiresAt,
    });

    // Send the email
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "French Language Verification OTP",
      html: `
        <h2>French Language Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    return res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
});
router.get("/test", (req, res) => {
  res.send("OTP route is working");
});
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const record = await Otp.findOne({ email });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "OTP not found",
      });
    }

    if (new Date() > record.expiresAt) {
      await Otp.deleteOne({ email });

      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    if (record.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    await Otp.deleteOne({ email });

    return res.json({
      success: true,
      message: "OTP verified successfully",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
});

module.exports = router;