const express = require("express");
const router = express.Router();

const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const User = require("../Model/User");
const sendEmail = require("../services/sendEmail");

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
    console.log("VERIFY PAYMENT BODY:",req.body);
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
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                subscription: {
                    plan,
                    applicationsAllowed,
                    applicationsUsed: 0,
                    expiryDate,
                },
            },
            { new: true }
        );
        const amount =
            plan === "Bronze"
                ? "₹100"
                : plan === "Silver"
                    ? "₹300"
                    : "₹1000";

        await sendEmail({
            to: updatedUser.email,
            subject: "Internera Subscription Activated",
            html: `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #ddd; border-radius:10px; overflow:hidden;">
      
      <div style="background:#2563eb; color:white; padding:20px; text-align:center;">
        <h1>Internera</h1>
        <h2>Payment Successful</h2>
      </div>

      <div style="padding:30px;">
        <p>Hi <strong>${updatedUser.name}</strong>,</p>

        <p>Thank you for subscribing to <strong>Internera</strong>. Your subscription has been activated successfully.</p>

        <table style="width:100%; border-collapse:collapse; margin-top:20px;">
          <tr>
            <td style="padding:10px; border:1px solid #ddd;"><strong>Plan</strong></td>
            <td style="padding:10px; border:1px solid #ddd;">${plan}</td>
          </tr>

          <tr>
            <td style="padding:10px; border:1px solid #ddd;"><strong>Amount Paid</strong></td>
            <td style="padding:10px; border:1px solid #ddd;">${amount}</td>
          </tr>

          <tr>
            <td style="padding:10px; border:1px solid #ddd;"><strong>Payment ID</strong></td>
            <td style="padding:10px; border:1px solid #ddd;">${razorpay_payment_id}</td>
          </tr>

          <tr>
            <td style="padding:10px; border:1px solid #ddd;"><strong>Order ID</strong></td>
            <td style="padding:10px; border:1px solid #ddd;">${razorpay_order_id}</td>
          </tr>

          <tr>
            <td style="padding:10px; border:1px solid #ddd;"><strong>Valid Until</strong></td>
            <td style="padding:10px; border:1px solid #ddd;">
              ${expiryDate.toDateString()}
            </td>
          </tr>
        </table>

        <p style="margin-top:30px;">
          Thank you for choosing Internera.
        </p>

        <p>
          Happy Learning! 🚀
        </p>
      </div>

      <div style="background:#f3f4f6; padding:15px; text-align:center; font-size:13px; color:#666;">
        © ${new Date().getFullYear()} Internera. All Rights Reserved.
      </div>

    </div>
  `,
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