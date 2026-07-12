const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
    },

    password: {
      type: String,
      required: false
    },

    lastPasswordReset: {
      type: Date,
      default: null,
    },
    firebaseUid: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true,
  },

);

module.exports = mongoose.model("User", userSchema);