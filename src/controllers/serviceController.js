import MedicalService from "../services/medicalService.js";
import logger from "../util/logger.js";
import responseFunction from "../util/response.function.js";

class ServiceController {
  async fetchServicesByDepartment(req, res, next) {
    try {
      const { departmentId } = req.params;

      const services = await MedicalService.findMedicalServicesByDepartment(
        departmentId
      );

      if (services.length === 0)
        return next({
          statusCode: 404,
          errMessage: "No services found for the provided department!",
        });

      res.status(200).json(
        responseFunction(
          200,
          true,
          "Retrieved all services according to department successfully...",
          {
            services,
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

  async getServiceAvailabilityType(req, res, next) {
    try {
      const { serviceType, serviceId } = req.params;
      const service = await MedicalService.findMedicalServicesAvailabilityType(
        serviceType,
        serviceId
      );

      if (!service)
        return next({
          statusCode: 404,
          errMessage: "No available type is found for the provided service!",
        });

      res.status(200).json(
        responseFunction(
          200,
          true,
          "Fetched available type for the service successfully...",
          {
            service,
          }
        )
      );
    } catch (error) {
      logger.error("Error in get service availability type: ", error);
      return next({
        statusCode: error.statusCode || 500,
        errMessage: error.message || "Internal Server Error",
      });
    }
  }
}

export default new ServiceController();
