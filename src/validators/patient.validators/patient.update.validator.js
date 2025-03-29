import joi from "joi";
import patientValidationSchema from "./patient.validator.js";

const patientUpdateValidationSchema = joi.object({
  firstName: patientValidationSchema.extract("firstName").optional(),
  lastName: patientValidationSchema.extract("lastName").optional(),
  mobileNumber: patientValidationSchema.extract("mobileNumber").optional(),
  password: patientValidationSchema.extract("password").optional(),
  patientImageUrl: patientValidationSchema
    .extract("patientImageUrl")
    .optional(),
});

export default patientUpdateValidationSchema;
