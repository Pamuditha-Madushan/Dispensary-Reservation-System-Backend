import patientEmailValidationSchema from "../../../validators/patient.validators/patient.email.validator.js";
import validate from "../../../util/validate.js";

const patientEmailValidation = async (req, res, next) => {
  const payload = {
    email: req.body.email,
  };

  const { error } = validate(patientEmailValidationSchema, payload);

  if (error)
    return next({
      statusCode: 406,
      errMessage: `Error in Patient Email Validation Data: ${error.message}`,
    });

  next();
};

export default patientEmailValidation;
