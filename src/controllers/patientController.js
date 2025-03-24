import Patient from "../models/patientModel.js";
import responseFunction from "../util/response.function.js";
import patientService from "../services/patientService.js";
import logger from "../util/logger.js";

class PatientController {
  async registerPatient(req, res, next) {
    try {
      const { firstName, lastName, mobileNumber, email, password } = req.body;
      const image = req.file;

      if (!image)
        return next({ statusCode: 400, errMessage: "No file uploaded!" });

      const userRecordData = await patientService.registerUser(email, password);
      const imageUrl = await patientService.uploadImage(image);

      const newPatientId = Patient.create({
        firstName,
        lastName,
        mobileNumber,
        email,
        patientImageUrl: imageUrl,
        // patientImageUrl: downloadURL[0],
        userId: userRecordData,
        createdAt: new Date().toISOString(),
      });

      res.status(201).json(
        responseFunction(201, true, "Patient Registration Successful ...", {
          patientId: newPatientId,
          userId: userRecordData,
          imageUrl,
        })
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

      const patient = await patientService.findPatient(userId);

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
}

export default new PatientController();
