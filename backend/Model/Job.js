const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  Experience: String,
  category: String,
  aboutCompany: String,
  aboutJob: String,
  whoCanApply: String,

  // Change Array -> String
  perks: String,

  numberOfOpening: String,

  AdditionalInfo: String,

  CTC: String,

  // lowercase
  StartDate: String,

  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Job", JobSchema);