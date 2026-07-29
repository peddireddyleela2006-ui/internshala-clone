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
      required: false,
    },

    lastPasswordReset: {
      type: Date,
      default: null,
    },

    firebaseUid: {
      type: String,
      required: false,
    },

    friends: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      default: [],
    },
    subscription: {
      plan: {
        type: String,
        enum: ["Free", "Bronze", "Silver", "Gold"],
        default: "Free",
      },

      applicationsAllowed: {
        type: Number,
        default: 1,
      },

      applicationsUsed: {
        type: Number,
        default: 0,
      },

      expiryDate: {
        type: Date,
        default: null,
      },

      paymentId: {
        type: String,
        default: null,
      },

      orderId: {
        type: String,
        default: null,
      },

      invoiceNumber: {
        type: String,
        default: null,
      },

      purchasedAt: {
        type: Date,
        default: null,
      }
    },

    // NEW: link resume with user
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);