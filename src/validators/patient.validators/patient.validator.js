import joi from "joi";

const patientValidationSchema = joi.object({
  firstName: joi.string().min(3).required(),
  lastName: joi.string().min(3).required(),
  mobileNumber: joi
    .string()
    .length(10)
    .regex(/^07[0-9]{8}$/)
    .required()
    .messages({
      "string.length": "Mobile number must be 10 digits long!",
      "string.regex":
        "Mobile number must start with 07 and rest should be consist of 8 digits!",
      "string.required": "Mobile number is required!",
    }),
  email: joi
    .string()
    .email()
    .lowercase()
    .trim(true)
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .required()
    .messages({
      "string.lowercase": "Email must be all lowercase!",
      "string.regex": "Email isn't valid!",
      "string.required": "Email is required!",
    }),
  password: joi.string().min(8).required(),
  patientImageUrl: joi.string().uri().optional(),
});

export default patientValidationSchema;
