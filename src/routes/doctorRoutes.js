import express from "express";
import DoctorController from "../controllers/doctorController.js";

const router = express.Router();

router.get(
  "/:departmentId/:specialization",
  DoctorController.fetchDoctorsBySpecialization
);

router.get(
  "/:departmentId/:specialization/:doctorId/availability-schedule",
  DoctorController.getDoctorAvailability
);

export default router;
