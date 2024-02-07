const Joi = require("joi");

const patientRegisterSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  mobileNumber: Joi.string()
    .length(10)
    .regex(/^07[0-9]{8}$/)
    .required()
    .messages({
      "string.length": "Mobile number must be 10 digits long.",
      "string.regex":
        "Mobile number must start with 07 and consist of 8 digits.",
      "string.required": "Mobile number is required.",
    }),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().alphanum().min(6).required(),
  // patientImageUrl: Joi.string().uri().required(),
});

const patientLoginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().alphanum().min(6).required(),
});

module.exports = { patientRegisterSchema, patientLoginSchema };
