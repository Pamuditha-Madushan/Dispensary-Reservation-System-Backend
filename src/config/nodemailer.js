import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  service: process.env.SMTP_SERVICE,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE,
  auth: {
    user: process.env.SMTP_AUTH_USER,
    pass: process.env.SMTP_AUTH_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sender = {
  email: process.env.SMTP_AUTH_USER,
};

const appName = process.env.APP_NAME;

export default transporter;
export { sender, appName };
