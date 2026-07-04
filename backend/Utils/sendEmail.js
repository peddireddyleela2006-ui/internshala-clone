const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, text }) => {
  const info = await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject,
    text,
  });

  console.log("Sending email to:", to);
  console.log("Email sent:", info.response);
};

module.exports = sendEmail;