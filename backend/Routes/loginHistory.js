const express = require("express");
const router = express.Router();
const LoginHistory = require("../Model/LoginHistory");
const User = require("../Model/User");
const UAParser = require("ua-parser-js");

router.post("/save", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const parser = new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();

    const browser = result.browser.name || "Unknown";
    const operatingSystem = result.os.name || "Unknown";

    let device = "Desktop";

    if (result.device.type) {
      device =
        result.device.type.charAt(0).toUpperCase() +
        result.device.type.slice(1);
    }

    const ipAddress =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      req.ip;

    await LoginHistory.create({
      userId: user._id,
      browser,
      operatingSystem,
      device,
      ipAddress,
    });

    return res.json({
      success: true,
      message: "Login history saved",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
router.get("/:email", async (req, res) => {
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

    const history = await LoginHistory.find({
      userId: user._id,
    }).sort({ loginTime: -1 });

    return res.json({
      success: true,
      history,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
});

module.exports = router;