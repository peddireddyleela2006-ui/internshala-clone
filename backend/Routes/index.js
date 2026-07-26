const express = require("express");
const router = express.Router();


const admin = require("./admin");
const intern = require("./internship");
const job = require("./job");
const application = require("./application");
const user = require("./user");
const passwordreset = require("./passwordreset");
const loginHistory = require("./loginHistory");
const post = require("./post");
const chat = require("./chat");
const resume = require("./resume");

router.use("/admin", admin);
router.use("/internship", intern);
router.use("/job", job);
router.use("/application", application);
router.use("/user", user);
router.use("/passwordreset", passwordreset);
router.use("/loginhistory", loginHistory);
router.use("/post", post);
router.use("/chat", chat);
router.use("/resume", resume);

module.exports = router;