import patientUpdateValidationSchema from "../../../validators/patient.validators/patient.update.validator.js";
import validate from "../../../util/validate.js";

const patientUpdateValidation = async (req, res, next) => {
  const payload = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    mobileNumber: req.body.mobileNumber,
    password: req.body.password,
  };

  const { error } = validate(patientUpdateValidationSchema, payload);

  if (error)
    return next({
      statusCode: 406,
      errMessage: `Error in Patient Update Validation Data: ${error.message}`,
    });

  next();
};

export default patientUpdateValidation;
