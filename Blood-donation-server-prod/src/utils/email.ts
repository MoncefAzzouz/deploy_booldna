import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { AppError } from "../utils/error.js";
import e from "express";

// Create transporter with your Octenium credentials
const transporter = nodemailer.createTransport({
  host: "mail.bloodna.com",
  port: 465,
  secure: true, // true for port 465
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Only if you have certificate issues
  },
});

// Verify connection on startup
transporter.verify((error) => {
  if (error) {
    console.error("❌ Email server connection failed:", error);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

export const sendEmail = async (toEmail: string, body: string) => {
  try {
    const mailOptions = {
      from: "Bloodna App <contact@bloodna.com>",
      to: toEmail,
      subject: "Confirm your email",
      html: body,
      // Optional: Add text version for better deliverability
      text: body.replace(/<[^>]*>/g, ""),
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent to ${toEmail}:`, info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw new AppError(
      `Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`,
      500,
    );
  }
};
