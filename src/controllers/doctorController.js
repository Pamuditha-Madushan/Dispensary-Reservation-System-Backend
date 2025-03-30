import DoctorService from "../services/doctorService.js";
import logger from "../util/logger.js";
import responseFunction from "../util/response.function.js";

class DoctorController {
  async fetchDoctorsBySpecialization(req, res, next) {
    try {
      const { departmentId, specialization } = req.params;

      const doctors = await DoctorService.findDoctorsBySpecialization(
        departmentId,
        specialization
      );

      if (doctors.length === 0)
        return next({
          statusCode: 404,
          errMessage: "No doctors found for the provided specialization!",
        });

      res.status(200).json(
        responseFunction(
          200,
          true,
          "Retrieved all doctors according to specialization successfully...",
          {
            doctors,
          }
        )
      );
    } catch (error) {
      logger.error("Error in update patient: ", error);
      return next({
        statusCode: error.statusCode || 500,
        errMessage: error.message || "Internal Server Error",
      });
    }
  }

  async getDoctorAvailability(req, res, next) {
    try {
      const { departmentId, specialization, doctorId } = req.params;

      const doctor = await DoctorService.findDoctorAvailability(
        departmentId,
        specialization,
        doctorId
      );

      if (!doctor || doctor.length === 0)
        return next({
          statusCode: 404,
          errMessage:
            "No available time schedule is found for the provided doctor id!",
        });

      res.status(200).json(
        responseFunction(
          200,
          true,
          "Fetched doctor availability successfully...",
          {
            doctor,
          }
        )
      );
    } catch (error) {
      logger.error("Error in update patient: ", error);

      return next({
        statusCode: error.statusCode || 500,
        errMessage: error.message || "Internal Server Error",
      });
    }
  }
}

export default new DoctorController();
