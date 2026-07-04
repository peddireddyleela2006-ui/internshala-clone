const express = require("express");
const router = express.Router();
const Otp = require("../Model/Otp");
const nodemailer = require("nodemailer");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "OTP route works" });
});

// Send OTP
router.post("/send-otp", async (req, res) => {
  try {
    console.log("✅ send-otp hit");

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Delete any previous OTPs for this email
    await Otp.deleteMany({ email });

    // Generate OTP
    const otp = generateOTP();

    // Save OTP in MongoDB
    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      used: false,
    });

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email
    const info = await transporter.sendMail({
  from: process.env.EMAIL,
  to: email,
  subject: "French Language OTP Verification",
  text: `Your OTP is ${otp}. It expires in 5 minutes.`,
});



    return res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.error("SEND OTP ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({
      email,
      otp,
      used: false,
    });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (record.expiresAt.getTime() < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    record.used = true;
    await record.save();

    return res.json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;