const bodyparser = require("body-parser");
const express = require("express");
const cors = require("cors");
const router=require("./Routes/index");
const { connect } = require("./db");

const app = express();
const port = 5000;

app.use(cors());

app.use(bodyparser.json({ limit: "50mb" }));
app.use(bodyparser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello this is from internera backend");
});
app.use("/api",router)

connect();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.listen(port, () => {
    console.log(`Server is running on the port ${port}`);
});