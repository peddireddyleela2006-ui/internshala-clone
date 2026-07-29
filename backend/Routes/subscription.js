const express = require("express");
const router = express.Router();

const User = require("../Model/User");

// GET current subscription
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      subscription: user.subscription,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// UPDATE subscription after payment
router.post("/update", async (req, res) => {
  try {
    const { userId, plan } = req.body;

    const plans = {
      Free: {
        applicationsAllowed: 1,
      },
      Bronze: {
        applicationsAllowed: 3,
      },
      Silver: {
        applicationsAllowed: 5,
      },
      Gold: {
        applicationsAllowed: Infinity,
      },
    };

    if (!plans[plan]) {
      return res.json({
        success: false,
        message: "Invalid plan",
      });
    }

    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 1);

    await User.findByIdAndUpdate(userId, {
      subscription: {
        plan,
        applicationsAllowed:
          plan === "Gold" ? 999999 : plans[plan].applicationsAllowed,
        applicationsUsed: 0,
        expiryDate: expiry,
      },
    });

    res.json({
      success: true,
      message: "Subscription updated",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;