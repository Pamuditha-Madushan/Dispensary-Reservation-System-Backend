import firebaseAdmin from "../config/firebaseAdminConfig.js";
import logger from "../util/logger.js";

const authLogger = logger.child({ module: "authentication" });

class patientService {
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

  async findPatient(userId) {
    try {
      const patientRef = await firebaseAdmin.realtimeDb.ref("patients");
      const snapshot = await patientRef
        .orderByChild("userId")
        .equalTo(userId)
        .once("value");
      return snapshot.exists ? snapshot.val() : null;
    } catch (error) {
      throw new Error(`Unable to find patient: ${error.message}`);
    }
  }
}

export default new patientService();
