import express from "express";
import ServiceController from "../controllers/serviceController.js";

const router = express.Router();

router.get("/:departmentId", ServiceController.fetchServicesByDepartment);

router.get(
  "/:serviceType/:serviceId",
  ServiceController.getServiceAvailabilityType
);

export default router;
