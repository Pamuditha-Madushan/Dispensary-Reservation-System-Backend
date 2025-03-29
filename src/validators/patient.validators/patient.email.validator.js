import joi from "joi";
import patientValidationSchema from "./patient.validator.js";

const patientEmailValidationSchema = joi.object({
  email: patientValidationSchema.extract("email").required(),
});

export default patientEmailValidationSchema;
