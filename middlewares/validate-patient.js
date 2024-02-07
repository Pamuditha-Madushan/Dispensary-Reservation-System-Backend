const Joi = require("joi");
// const { patientSchema } = require("../util/validation");

const patientSchema = Joi.object({
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
  //patientImageUrl: Joi.string().uri().required(),
});

async function validatePatient(req, res, next) {
  try {
    const formDataObject = {};
    for (const [key, value] of Object.entries(req.body)) {
      formDataObject[key] = value;
    }
    console.log("Request body in validatePatient:", formDataObject);

    await patientSchema.validateAsync(formDataObject, { abortEarly: false });
    next();
  } catch (error) {
    console.error("Validation error:", error);
    /*const errors = error.details.map((err) => ({
      message: err.message,
      path: err.path,
      type: err.type,
      context: err.context,
    }));

    */

    return res.status(400).send({
      statusCode: 400,
      success: false,
      error: error.details,
    });
  }
}

/*

function validatePatient(req, res, next) {
  const formDataObject = {};

  for (const [key, value] of Object.entries(req.body)) {
    formDataObject[key] = value;
  }

  console.log("Request body in validatePatient:", formDataObject);

  // Use validate without async/await, handle errors in the callback
  patientSchema.validate(
    formDataObject,
    { abortEarly: false },
    (error, value) => {
      if (error) {
        console.error("Validation error:", error);
        return res.status(400).send({
          statusCode: 400,
          success: false,
          error: error.details,
        });
      }

      // No validation errors, proceed to the next middleware
      next();
    }
  );
}


*/

/*

function validatePatient(req, res, next) {
  const { error: validationErr } = patientSchema.validate(req.body);
  if (validationErr) {
    return res.status(400).send({
      statusCode: 400,
      success: false,
      errors: validationErr.details,
    });
  }

  next();
}

*/

module.exports = validatePatient;
