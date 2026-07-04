const express = require("express");
const router = express.Router();
const User = require("../Model/User");
const { auth } = require("../firebaseAdmin");
const PasswordReset = require("../Model/PasswordReset");
const generatePassword = require("../Utils/passwordGenerator");
const sendEmail = require("../Utils/sendEmail");




router.post("/", async (req, res) => {
    try {
        const { email, phone } = req.body;
        console.log("Request body:", req.body);
        console.log("Email:", email);
        console.log("Phone:", phone);
        if (!email && !phone) {
            return res.status(400).json({
                success: false,
                message: "Email or phone number is required.",
            });
        }

        let user;

        // Find Firebase user
        if (email) {
            user = await auth.getUserByEmail(email);
        } else {
            const userProfile = await User.findOne({ phone });
            console.log("MongoDB user profile:", userProfile);
            if (!userProfile) {
                return res.status(404).json({
                    success: false,
                    message: "Phone number is not registered.",
                });
            }

            user = await auth.getUserByEmail(userProfile.email);
            console.log("Firebase User:", user.email);
        }

        // Check last reset
        let resetRecord = await PasswordReset.findOne({
            uid: user.uid,
        });

        if (resetRecord && resetRecord.lastReset) {
            const today = new Date();
            const last = new Date(resetRecord.lastReset);

            const sameDay =
                today.getDate() === last.getDate() &&
                today.getMonth() === last.getMonth() &&
                today.getFullYear() === last.getFullYear();

            if (sameDay) {
                return res.status(429).json({
                    success: false,
                    message: "You can use this option only once per day.",
                });
            }
        }

        // Generate new password
        const newPassword = generatePassword(12);

        // Update Firebase password
        await auth.updateUser(user.uid, {
            password: newPassword,
        });
        // console.log("Firebase user:", user.email);

        // Send email
        await sendEmail({
            to: user.email,
            subject: "Internera Password Reset",
            text: `Hello,

Your password has been reset successfully.

Your new password is:

${newPassword}

Please log in using this password and change it after logging in.

If you did not request this password reset, please contact our support team.

Regards,
Internera Team`,
        });
        console.log("Existing reset record:", resetRecord);
        // Save reset history
        if (resetRecord) {
            resetRecord.lastReset = new Date();
            resetRecord.email = user.email;

            await resetRecord.save();
        } else {
            console.log("Creating PasswordReset record...");
            await PasswordReset.create({
                // console.log("PasswordReset record created."),
                uid: user.uid,
                email: user.email,
                lastReset: new Date(),
            });
        }

        return res.json({
            success: true,
            message: "A new password has been sent to your registered email.",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;