import transporter, { sender } from "../config/nodemailer.js";
import { promisify } from "util";
import {
  passwordResetEmailTemplate,
  verificationEmailTemplate,
} from "./emailTemplate.js";
import logger from "./logger.js";

const emailTransportBinder = promisify(transporter.sendMail.bind(transporter));

const sendPasswordResetEMail = async (email, displayName, link, appName) => {
  try {
    const mailOptions = {
      from: sender.email,
      to: email,
      subject: "Reset password link",
      html: passwordResetEmailTemplate(email, displayName, link, appName),
    };

    await emailTransportBinder(mailOptions);
    logger.info(`Password reset link sent successfully to: ${email}`);
  } catch (error) {
    logger.error(
      `Error in [sendPasswordResetEmail] utility due to: ${error.message}`
    );
    throw error;
  }
};

const sendVerificationEMail = async (email, displayName, link, appName) => {
  try {
    const mailOptions = {
      from: sender.email,
      to: email,
      subject: "Verification link",
      html: verificationEmailTemplate(displayName, link, appName),
    };

    await emailTransportBinder(mailOptions);
    logger.info(`Verification link email sent successfully to: ${email}`);
  } catch (error) {
    logger.error(
      `Error in [sendVerificationEMail] utility due to: ${error.message}`
    );
    throw error;
  }
};

export { sendPasswordResetEMail, sendVerificationEMail };
