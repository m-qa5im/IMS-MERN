import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASSWORD,
  },
});


export default transporter;