//const Patient = require("../models/patientModel");
const { admin } = require("../config/firebaseAdminConfig");
const PatientModel = require("../models/patientModel");
const patientAuthController = require("./patientAuthController");

const multer = require("multer");

// const multerStorage = multer.memoryStorage();
// const upload = multer({ dest: "temp/", storage: multerStorage });
const storage = admin.storage().bucket();

class PatientController {
  static async registerPatient(req, res) {
    try {
      /*
      upload.single("patientImageFile")(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          return res
            .status(400)
            .json({ error: "Error uploading image: " + err.message });
        } else if (err) {
          return res.status(500).send({
            statusCode: 500,
            error: err.message,
          });
        }

*/

      /*
        const { error, value } = patientSchema.validate(req.body);
        if (error) {
          return res.status(400).json({ error: error.details[0].message });
        }
*/
      const { firstName, lastName, mobileNumber, email, password } = req.body;
      const patientImageFile = req.file;
      //const data = JSON.parse(req.body.data);

      if (!patientImageFile) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const userRecordData = await patientAuthController.registerUser({
        email,
        password,
      });

      // Use the original name of the file to create a reference to the file in Firebase Storage
      const file = storage.file(patientImageFile.originalname);
      const stream = file.createWriteStream({
        metadata: {
          contentType: patientImageFile.mimetype,
          contentDisposition: "inline",
        },
      });

      stream.on("error", (err) => {
        console.error(err);
        res
          .status(500)
          .json({ error: "Error uploading image to Firebase Storage" });
      });

      stream.on("finish", async () => {
        // Get the download URL of the uploaded image
        try {
          const downloadURL = await file.getSignedUrl({
            action: "read",
            expires: "03-01-2024",
          });

          // Register the user with the download URL as an attribute
          const newPatientModelRecord = PatientModel.create({
            firstName,
            lastName,
            mobileNumber,
            email,
            patientImageUrl: downloadURL[0],
            userId: userRecordData,
          });
          // Save the user to the database (not shown here)

          res.status(201).json({
            statusCode: 201,
            success: true,
            message: "Patient Registration Successful ...",
            data: {
              newPatientModelRecord,
              userRecordData,
              imageUrl: downloadURL[0],
            },
          });
        } catch (error) {
          console.error(error);
          res.status(500).send({
            statusCode: 500,
            success: false,
            error: error.message,
          });
        }
      });

      stream.end(patientImageFile.buffer);
      //});
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        success: false,
        error: error.message,
      });
    }
  }

  static async loginPatient(req, res) {
    try {
      const { email, password } = req.body;

      const patientModelRecord = await patientAuthController.loginUser({
        email,
        password,
      });

      if (patientModelRecord) {
        res.status(200).json({
          statusCode: 200,
          success: true,
          message: "Patient Login Successful ...",
          data: {
            patientModelRecord,
          },
        });
      } else {
        res.status(401).send({
          statusCode: 401,
          success: false,
          error: "Invalid email or password !!!",
        });
      }
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = PatientController;

/*
exports.registerPatientController = async (req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.registerPatientModel();
    res.status(201).json({ message: "Patient registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering patient", error: error.message });
  }
};

*/
