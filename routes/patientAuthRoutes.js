const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");
const {
  patientRegisterSchema,
  patientLoginSchema,
} = require("../util/validationSchema");
const multer = require("multer");
//const validatePatient = require("../middlewares/validate-patient");

const multerStorage = multer.memoryStorage();
const upload = multer({ dest: "temp/", storage: multerStorage });
/*
router.post(
  "/register-patient",
  validatePatient,
  patientController.registerPatient
);

*/

router.post(
  "/register-patient",
  upload.single("patientImageFile"),
  async (req, res, next) => {
    const formData = req.body;

    const { error, value } = patientRegisterSchema.validate(formData, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // If validation passes, proceed with your logic
    // Access validated data through value
    next();
  },

  async (req, res) => {
    // Now you can safely call your registration logic
    await patientController.registerPatient(req, res);
  }
);

/*
router.post("/register-patient", validatePatient, (req, res, next) => {
  patientController
    .registerPatient(req, res)
    .then(() => {
      res.status(201).send({ message: "Patient Registered" });
    })
    .catch((err) => {
      res.status(500).send({ errors: err.details });
    });
});

*/

router.post(
  "/patient-login",
  async (req, res, next) => {
    const { error } = patientLoginSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // If validation passes, proceed with your logic
    // Access validated data through value
    next();
  },

  async (req, res) => {
    // Now you can safely call your registration logic
    await patientController.loginPatient(req, res);
  }
);

{
  /*router.post("/register-patient", patientController.registerPatientController); */
}

module.exports = router;
