const transporter = require("../config/transporter");
const express = require("express");
const router = express.Router();
const resend = require("../config/resend");
const Otp = require("../Model/Otp");

router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    console.log("OTP request received");
    console.log("Email:", email);

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
    console.log("About to send OTP to:", email);
    // Send the email
    // Send the email
    console.log("About to send OTP to:", email);

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "French Language Verification OTP",
      html: `
    <h2>Your OTP is: ${otp}</h2>
    <p>This OTP expires in 5 minutes.</p>
  `,
    });

    console.log("Resend response:", response);

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
router.get("/test-email", async (req, res) => {
  try {
    console.log("EMAIL:", process.env.EMAIL);
    console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAIL, // send to yourself first
      subject: "Nodemailer Test",
      text: "Congratulations! Nodemailer is working.",
    });

    console.log("Email sent:", info);

    res.json({
      success: true,
      message: "Test email sent successfully",
    });
  } catch (error) {
    console.error("Email error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send test email",
      error: error.message,
    });
  }
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