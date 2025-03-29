import Patient from "../models/patientModel.js";

export const checkLogoutState = async (req, res, next) => {
  const userId = req.user.uid;

  if (!userId)
    return next({
      statusCode: 401,
      errMessage: "Unauthorized: User ID not found!",
    });

  const patientRef = await Patient.getPatientDataByUserId(userId);
  if (patientRef && patientRef.loggedOut === true)
    return next({
      statusCode: 403,
      errMessage: "Unauthorized: This user has logged out!",
    });

  next();
};
