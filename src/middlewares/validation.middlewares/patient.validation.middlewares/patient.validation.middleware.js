import patientValidationSchema from "../../../validators/patient.validators/patient.validator.js";
import validate from "../../../util/validate.js";

const patientValidation = async (req, res, next) => {
  const payload = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    mobileNumber: req.body.mobileNumber,
    email: req.body.email,
    password: req.body.password,
  };

  const { error } = validate(patientValidationSchema, payload);

  if (error) {
    return next({
      statusCode: 406,
      errMessage: `Error in Patient Validation Data: ${error.message}`,
    });
  }

  next();
};

export default patientValidation;
