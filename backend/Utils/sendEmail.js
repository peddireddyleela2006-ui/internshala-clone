const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, text }) => {
  console.log("EMAIL:", process.env.EMAIL);
  console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

  try {
    console.log("Verifying transporter...");
    await transporter.verify();
    console.log("Transport verified");

    console.log("Sending email...");

    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      text,
    });

    console.log("Email sent:", info.response);
  } catch (err) {
    console.error("Email Error:", err);
    throw err;
  }
};

module.exports = sendEmail;