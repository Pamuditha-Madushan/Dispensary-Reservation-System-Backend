import express from "express";
import multer from "multer";
import patientController from "../controllers/patientController.js";
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
  patientController.registerPatient
);

router.get(
  "/dashboard",
  verifyIdToken,
  checkLogoutState,
  patientController.getPatientInfo
);

router.post(
  "/update-logged-out-state",
  verifyIdToken,
  patientController.updateLoggedInState
);

router.post(
  "/reset-password",
  patientEmailValidation,
  patientController.resetPassword
);

router.post(
  "/verify-email",
  patientEmailValidation,
  patientController.verifyEmail
);

router.patch(
  "/update-data",
  patientUpdateValidation,
  verifyIdToken,
  checkLogoutState,
  patientController.updatePatientData
);

router.post(
  "/logout",
  verifyIdToken,
  checkLogoutState,
  patientController.handleLogout
);

export default router;
