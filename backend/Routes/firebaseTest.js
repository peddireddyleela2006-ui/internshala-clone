const express = require("express");
const router = express.Router();
const { auth } = require("../firebaseAdmin");

router.get("/firebase-test", async (req, res) => {
  try {
    const users = await auth.listUsers(1);

    res.json({
      success: true,
      message: "Firebase Admin connected successfully!",
      totalUsersChecked: users.users.length,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;