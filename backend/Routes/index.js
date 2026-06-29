const express = require("express");
const router = express.Router()
const admin = require("./admin")
const intern=require("./internship")
const job=require("./job")
const application=require("./application")

console.log("admin:", admin);
console.log("intern:", intern);
console.log("job:", job);
console.log("application:", application);

router.use('/admin', admin)
router.use('/internship', intern)
router.use('/job', job)
router.use('/application', application)

module.exports = router;