const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const verifyAccessToken = require("../middlewares/authorize-patient");

router.get(
  "/patient-info",
  verifyAccessToken,
  dashboardController.retrievePatientInfo
);

module.exports = router;
