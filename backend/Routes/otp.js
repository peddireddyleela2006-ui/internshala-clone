
const express = require("express");
const router = express.Router();
const Otp = require("../Model/Otp");
const sendEmail = require("../services/sendEmail");
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
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await Otp.deleteMany({ email });
    await Otp.create({
      email,
      otp,
      expiresAt,
    });
    console.log("About to send OTP to:", email);
    await sendEmail({
      to: email,
      subject: "French Language Verification OTP",
      html: `
    <h2>Your OTP is: ${otp}</h2>
    <p>This OTP expires in 5 minutes.</p>
  `,
    });

    console.log("OTP email sent successfully.");
    return res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log("EMAIL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
});
router.get("/test", (req, res) => {
  res.send("OTP route is working");
})
router.get("/test-email", async (req, res) => {
  try {
    await sendEmail({
      to: process.env.EMAIL,
      subject: "Brevo API Test",
      html: `
        <h2>Success 🎉</h2>
        <p>Your Brevo API integration is working.</p>
      `,
    });

    res.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
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
        message: "Email and OTP are required"
      });
    }
    const record = await Otp.findOne({ email });
    if (!record) {
      return res.status(404).json({
        success: false,
        message: "OTP not found"
      });
    }
    if (new Date() > record.expiresAt) {

      await Otp.deleteOne({ email });

      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });

    }
    if (record.otp !== otp) {

      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });

    }
    await Otp.deleteOne({ email });
    res.json({
      success: true,
      message: "OTP verified successfully"
    });
  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "OTP verification failed"
    });
  }
});

module.exports = router;