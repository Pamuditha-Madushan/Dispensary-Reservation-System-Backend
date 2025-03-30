import express from "express";
import multer from "multer";
import PatientController from "../controllers/patientController.js";
import patientValidation from "../middlewares/validation.middlewares/patient.validation.middlewares/patient.validation.middleware.js";
import verifyIdToken from "../middlewares/authorize-patient.js";
import { checkLogoutState } from "../middlewares/check.logout.middleware.js";
import patientEmailValidation from "../middlewares/validation.middlewares/patient.validation.middlewares/patient.email.validation.middleware.js";
import patientUpdateValidation from "../middlewares/validation.middlewares/patient.validation.middlewares/patient.update.validation.middleware.js";

const router = express.Router();

const multerStorage = multer.memoryStorage();
const upload = multer({ dest: "uploads/", storage: multerStorage });

router.post(
  "/signup",
  upload.single("image"),
  patientValidation,
  PatientController.registerPatient
);

router.get(
  "/dashboard",
  verifyIdToken,
  checkLogoutState,
  PatientController.getPatientInfo
);

router.post(
  "/update-logged-out-state",
  verifyIdToken,
  PatientController.updateLoggedInState
);

router.post(
  "/reset-password",
  patientEmailValidation,
  PatientController.resetPassword
);

router.post(
  "/verify-email",
  patientEmailValidation,
  PatientController.verifyEmail
);

router.patch(
  "/update-data",
  patientUpdateValidation,
  verifyIdToken,
  checkLogoutState,
  PatientController.updatePatientData
);

router.post(
  "/logout",
  verifyIdToken,
  checkLogoutState,
  PatientController.handleLogout
);

export default router;
