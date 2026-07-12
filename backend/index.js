require("dotenv").config();
console.log("EMAIL:", process.env.EMAIL);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Missing");
const express = require("express");
const cors = require("cors");
const { connect } = require("./db");
const router = require("./Routes/index");
const otpRoute = require("./Routes/otp");
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.get("/", (req, res) => {
  res.send("Hello this is from internera backend");
});


app.use("/api/otp", otpRoute);

app.use("/api", router);

connect();


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});