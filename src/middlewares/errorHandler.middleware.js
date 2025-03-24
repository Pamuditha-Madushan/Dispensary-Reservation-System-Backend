import logger from "../util/logger.js";
import responseFunction from "../util/response.function.js";

const errorHandler = (err, req, res, next) => {
  logger.error(err);

  let statusCode = err.statusCode || 500;
  let errMessage = err.errMessage || "Internal Server Error";

  return res
    .status(statusCode)
    .json(responseFunction(statusCode, false, errMessage));
};

export default errorHandler;
