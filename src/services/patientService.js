import firebaseAdmin from "../config/firebaseAdminConfig.js";
import Patient from "../models/patientModel.js";
import logger from "../util/logger.js";

const authLogger = logger.child({ module: "authentication" });

class PatientService {
  async registerUser(email, password) {
    try {
      const userRecord = await firebaseAdmin.auth.createUser({
        email,
        password,
      });
      return userRecord.uid;
    } catch (error) {
      throw new Error(`Auth Error [register user]: ${error.message}`);
    }
  }

  async registerPatient(patientData) {
    try {
      const { email } = patientData;
      const userId = await this.registerUser(email, patientData.password);
      return await Patient.create({
        ...patientData,
        userId,
      });
    } catch (error) {
      throw new Error(`Error in [register patient]: ${error.message}`);
    }
  }

  async uploadImage(file) {
    const bucket = firebaseAdmin.storage.bucket();

    try {
      const uploadOptions = {
        metadata: {
          contentType: file.mimetype,
          contentDisposition: `inline; filename="${file.originalname}"`,
          metadata: {
            customMetadata: {
              uploadedAt: new Date().toISOString(),
            },
          },
        },
      };

      const fileUpload = bucket.file(file.originalname);

      await fileUpload.save(file.buffer, uploadOptions);

      const downloadURL = await fileUpload.getSignedUrl({
        action: "read",
        expires: "03-01-2026",
      });

      return downloadURL;

      // Use the original name of the file to create a reference to the file in Firebase Storage
      // const file = storage.file(image.originalname);
      // const stream = file.createWriteStream({
      //   metadata: {
      //     contentType: image.mimetype,
      //     contentDisposition: "inline",
      //   },
      // });

      // stream.on("error", (err) => {
      //   console.error(err);
      //   res
      //     .status(500)
      //     .json(
      //       responseFunction(
      //         500,
      //         false,
      //         "Error uploading image to Firebase Storage"
      //       )
      //     );
      // });

      // stream.on("finish", async () => {
      //   // Get the download URL of the uploaded image
      //   try {
      //     const downloadURL = await file.getSignedUrl({
      //       action: "read",
      //       expires: "03-01-2026",
      //     });

      // stream.end(image.buffer);
    } catch (error) {
      throw new Error(`Storage Error: ${error.message}`);
    }
  }

  async verifyIdToken(idToken) {
    try {
      authLogger.info({}, "Authentication attempt.");
      const decodedToken = await firebaseAdmin.auth.verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      throw new Error(
        `Unauthorized access [verify ID Token]: ${error.message}`
      );
    }
  }

  async findPatientDataByUserId(userId) {
    try {
      return await Patient.getPatientDataByUserId(userId);
    } catch (error) {
      throw new Error(`Unable to find patient using userID: ${error.message}`);
    }
  }

  async findPatientIdByUserId(userId) {
    try {
      return await Patient.getPatientKeyByUserId(userId);
    } catch (error) {
      throw new Error(
        `Unable to find patient id using userID: ${error.message}`
      );
    }
  }

  async findPatientNameByEmail(email) {
    try {
      return await Patient.getPatientNameByEmail(email);
    } catch (error) {
      throw new Error(`Unable to find patient using email: ${error.message}`);
    }
  }

  async revokeIdToken(userId) {
    try {
      await firebaseAdmin.auth.revokeRefreshTokens(userId);
      await Patient.updateLogoutState(userId, true);
      return true;
    } catch (error) {
      throw new Error(`Unable to revoke id token: ${error.message}`);
    }
  }

  async setLoggedInState(userId, loggedOut) {
    try {
      await Patient.updateLogoutState(userId, loggedOut);
      return true;
    } catch (error) {
      throw new Error(`Unable to update login state: ${error.message}`);
    }
  }

  async verifyEmail(userId) {
    const emailVerified = await Patient.isEmailVerified(userId);
    return emailVerified;
  }

  async initiatePasswordReset(email) {
    const userRecord = await firebaseAdmin.auth.getUserByEmail(email);
    const isVerified = await this.verifyEmail(userRecord.uid);

    if (!isVerified)
      throw new Error(
        "Email address needs to be verified before resetting the password!"
      );

    try {
      const patientId = await Patient.getPatientKeyByUserId(userRecord.uid);

      if (!patientId || patientId.length === 0)
        throw new Error("Patient not found for the given userId.");

      if (!(await Patient.canResetPassword(patientId)))
        throw new Error("You can only reset your password once every 7 days!");

      const resetLink = await Patient.sendPasswordResetEmail(email);
      await Patient.updateLastPasswordReset(patientId);
      return resetLink;
    } catch (error) {
      throw new Error(`Error sending password reset email: ${error.message}`);
    }
  }

  async initiateEmailVerification(email) {
    try {
      const userRecord = await firebaseAdmin.auth.getUserByEmail(email);
      const isVerified = await this.verifyEmail(userRecord.uid);
      if (isVerified) throw new Error("Email address is already verified!");
      const verificationLink = await Patient.sendEmailVerification(email);
      return verificationLink;
    } catch (error) {
      throw new Error(
        `Error sending email verification email: ${error.message}`
      );
    }
  }

  async modifyPatient(patientId, newData) {
    try {
      const currentPatientData = await Patient.getPatientDataById(patientId);

      if (newData.email) throw new Error("Email cannot be updated!");

      const updatedFields = Object.keys(newData).filter(
        (key) => newData[key] !== null && newData[key] !== ""
      );

      if (updatedFields.length === 0)
        throw new Error(
          "At least one field with a valid value is required to perform the update!"
        );

      if (newData.password) {
        if (newData.password === currentPatientData.password)
          throw new Error(
            "New password cannot be the same as the last password!"
          );

        await Patient.updateLastPasswordReset(patientId);
      }

      const filteredData = updatedFields.reduce((acc, key) => {
        acc[key] = newData[key];
        return acc;
      }, {});

      await Patient.updatePatient(patientId, filteredData);
    } catch (error) {
      throw new Error(`Error modifying patient data: ${error.message}`);
    }
  }
}

export default new PatientService();
