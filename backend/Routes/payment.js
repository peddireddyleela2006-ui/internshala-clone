const express = require("express");
const router = express.Router();

const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const User = require("../Model/User");

router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // Razorpay expects paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      plan,
    } = req.body;

    // Generate expected signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Verify signature
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Subscription details
    let applicationsAllowed = 1;

    if (plan === "Bronze") applicationsAllowed = 3;
    if (plan === "Silver") applicationsAllowed = 5;
    if (plan === "Gold") applicationsAllowed = 999999;

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    // Update user subscription
    await User.findByIdAndUpdate(userId, {
      subscription: {
        plan,
        applicationsAllowed,
        applicationsUsed: 0,
        expiryDate,
      },
    });

    res.json({
      success: true,
      message: "Subscription activated successfully",
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