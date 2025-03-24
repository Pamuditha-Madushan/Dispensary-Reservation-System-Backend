import pinoHttp from "pino-http";
import logger from "../util/logger.js";

export const httpLogger = pinoHttp({
  logger,
  customLogLevel: (res, err) => {
    if (res.statusCode >= 500 || err) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      //   headers: {
      //     ...req.headers,
      //     authorization: undefined,
      //   },
    }),
    res: pinoHttp.stdSerializers.res,
  },
});
