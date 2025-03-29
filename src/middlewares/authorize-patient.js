import patientService from "../services/patientService.js";
import logger from "../util/logger.js";

const authLogger = logger.child({ module: "authentication" });

const verifyIdToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer "))
    return next({
      statusCode: 401,
      errMessage: "Authorization header is missing or malformed!",
    });

  const idToken = authHeader.split(" ")[1];

  if (!idToken) {
    return next({
      statusCode: 401,
      errMessage: "Access token not provided!",
    });
  }

  try {
    const decodedToken = await patientService.verifyIdToken(idToken);

    req.user = decodedToken;
    req.user.uid = decodedToken.uid;

    next();
  } catch (error) {
    authLogger.error({ error }, "Authentication failed!");
    return next({
      statusCode: error.statusCode || 403,
      errMessage: "Invalid access token or an unauthorized request!",
    });
  }
};

export default verifyIdToken;
