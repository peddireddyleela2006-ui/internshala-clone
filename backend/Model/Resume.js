const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    education: {
      type: String,
      required: true,
    },

    skills: {
      type: String,
      required: true,
    },

    experience: {
      type: String,
      default: "",
    },

    about: {
      type: String,
      default: "",
    },

    photo: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("Resume", resumeSchema);