import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendWelcomeEmail = async (email, name) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to Docify 🚀",
    html: `
      <h2>Hello ${name},</h2>
      <p>Welcome to Xaviers Writer – your real-time collaborative editor.</p>
      <p>Start creating amazing documents now!</p>
    `
  });
};
