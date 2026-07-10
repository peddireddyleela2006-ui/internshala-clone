require("dotenv").config();
console.log("EMAIL:", process.env.EMAIL);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Missing");

// const userRoutes = require("./Routes/userRoutes");
//const firebaseTest = require("./Routes/firebaseTest");
// const forgotPasswordRoutes = require("./Routes/forgotPassword");
const express = require("express");
//const bodyParser = require("body-parser");
const cors = require("cors");

const { connect } = require("./db");
const router = require("./Routes/index");
// const otpRoutes = require("./Routes/otpRoutes");

const app = express();
const port = 5000;

// =======================
// Middleware
// =======================
app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// =======================
// Test Route
// =======================
app.get("/", (req, res) => {
  res.send("Hello this is from internera backend");
});

// =======================
// API Routes
// =======================
// app.use("/api/otp", otpRoutes);
// app.use("/api/forgot-password", forgotPasswordRoutes);
// app.use("/api/users", userRoutes);
app.use("/api", router);
//app.use("/api", firebaseTest);

// =======================
// Database
// =======================
connect();

// =======================
// Start Server
// =======================
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});