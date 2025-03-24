import express from "express";
import multer from "multer";
import patientController from "../controllers/patientController.js";
import patientValidation from "../middlewares/validation.middlewares/patient.validation.middlewares/patient.validation.middleware.js";
import patientLoginValidation from "../middlewares/validation.middlewares/patient.validation.middlewares/patient.login.validation.middleware.js";
import verifyIdToken from "../middlewares/authorize-patient.js";

const router = express.Router();

const multerStorage = multer.memoryStorage();
const upload = multer({ dest: "uploads/", storage: multerStorage });

router.post(
  "/signup",
  upload.single("image"),
  patientValidation,
  patientController.registerPatient
);

router.get("/dashboard", verifyIdToken, patientController.getPatientInfo);

export default router;
