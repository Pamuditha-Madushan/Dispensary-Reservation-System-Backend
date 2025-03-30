import responseFunction from "../util/response.function.js";
import PatientService from "../services/patientService.js";
import logger from "../util/logger.js";
import {
  sendPasswordResetEMail,
  sendVerificationEMail,
} from "../util/sendEmail.js";
import { appName } from "../config/nodemailer.js";

class PatientController {
  async registerPatient(req, res, next) {
    try {
      const { firstName, lastName, mobileNumber, email, password } = req.body;
      const image = req.file;

      if (!image)
        return next({ statusCode: 400, errMessage: "No file uploaded!" });

      const imageUrl = await PatientService.uploadImage(image);

      const patientData = {
        firstName,
        lastName,
        mobileNumber,
        email,
        password,
        patientImageUrl: imageUrl,
        // patientImageUrl: downloadURL[0],
      };

      const newPatientId = await PatientService.registerPatient(patientData);

      const app = appName;
      const verificationLink = await PatientService.initiateEmailVerification(
        email
      );
      await sendVerificationEMail(
        patientData.email,
        patientData.firstName,
        verificationLink,
        app
      );

      res.status(201).json(
        responseFunction(
          201,
          true,
          "Patient Registration and Verification Email Sent Successfully...",
          {
            patientId: newPatientId,
            imageUrl,
          }
        )
      );
    } catch (error) {
      logger.error("Error in register patient: ", error);
      return next({
        statusCode: error.statusCode || 500,
        errMessage: error.message || "Internal Server Error",
      });
    }
  }

  async getPatientInfo(req, res, next) {
    try {
      const userId = req.user.uid;

      if (!userId)
        return next({
          statusCode: 401,
          errMessage: `User Id is not received from the token!`,
        });

      const patient = await PatientService.findPatientDataByUserId(userId);

      if (!patient || Object.keys(patient).length === 0)
        return next({
          statusCode: 404,
          errMessage: "No patient found!",
        });

      res.status(200).json(
        responseFunction(200, true, "Patient Data Retrieved Successfully...", {
          patient,
        })
      );
    } catch (error) {
      logger.error("Error in verify patient: ", error);
      return next({
        statusCode: error.statusCode || 500,
        errMessage: error.message || "Internal Server Error",
      });
    }
  }

  async handleLogout(req, res, next) {
    try {
      const userId = req.user.uid;

      if (!userId)
        return next({
          statusCode: 401,
          errMessage: `User Id is not retrievable!`,
        });

      await PatientService.revokeIdToken(userId);

      res.status(200).json(
        responseFunction(200, true, "Patient Logout Successful...", {
          "logged Out": true,
        })
      );
    } catch (error) {
      logger.error("Error in patient logout: ", error);
      return next({
        statusCode: error.statusCode || 500,
        errMessage: error.message || "Internal Server Error",
      });
    }
  }

  async updateLoggedInState(req, res, next) {
    try {
      const userId = req.user.uid;
      const { loggedOut } = req.body;

      await PatientService.setLoggedInState(userId, loggedOut);
      res.status(200).json(
        responseFunction(
          200,
          true,
          "Patient Logged in State Updated Successfully...",
          {
            "Logged In": true,
          }
        )
      );
    } catch (error) {
      logger.error("Error in patient logged in state update: ", error);
      return next({
        statusCode: error.statusCode || 500,
        errMessage: error.message || "Internal Server Error",
      });
    }
  }

  async resetPassword(req, res, next) {
    const { email } = req.body;
    try {
      const displayName = await PatientService.findPatientNameByEmail(email);

      if (!displayName || displayName === null)
        return next({
          statusCode: 404,
          errMessage: "No patient found!",
        });

      const app = appName;
      const resetLink = await PatientService.initiatePasswordReset(email);
      await sendPasswordResetEMail(email, displayName, resetLink, app);
      res.status(200).json(
        responseFunction(
          200,
          true,
          "Password reset email sent successfully...",
          {
            "password Reset": "sent",
          }
        )
      );
    } catch (error) {
      logger.error("Error in password reset: ", error);
      return next({
        statusCode: error.statusCode || 500,
        errMessage: error.message || "Internal Server Error",
      });
    }
  }

  async verifyEmail(req, res, next) {
    const { email } = req.body;
    try {
      const displayName = await PatientService.findPatientNameByEmail(email);

      if (!displayName || displayName === null)
        return next({
          statusCode: 404,
          errMessage: "No patient found!",
        });

      const app = appName;
      const verificationLink = await PatientService.initiateEmailVerification(
        email
      );
      await sendVerificationEMail(email, displayName, verificationLink, app);
      res.status(200).json(
        responseFunction(
          200,
          true,
          "Email verification link sent successfully...",
          {
            "email verification": "sent",
          }
        )
      );
    } catch (error) {
      logger.error("Error in verify email: ", error);
      return next({
        statusCode: error.statusCode || 500,
        errMessage: error.message || "Internal Server Error",
      });
    }
  }

  async updatePatientData(req, res, next) {
    try {
      const userId = req.user.uid;
      const { firstName, lastName, mobileNumber, password } = req.body;
      let imageUrl;

      if (req.file && req.file.image)
        imageUrl = await PatientService.uploadImage(req.file.image);

      const patientData = {
        ...req.body,
      };

      if (imageUrl && imageUrl !== undefined)
        patientData.patientImageUrl = imageUrl;

      const patientId = await PatientService.findPatientIdByUserId(userId);

      const result = await PatientService.modifyPatient(patientId, patientData);
      res.status(200).json(
        responseFunction(200, true, "Patient Data updated successfully...", {
          "user ID": patientId,
        })
      );
    } catch (error) {
      logger.error("Error in update patient: ", error);
      return next({
        statusCode: error.statusCode || 500,
        errMessage: error.message || "Internal Server Error",
      });
    }
  }
}

export default new PatientController();
