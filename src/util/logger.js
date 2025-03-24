import pino from "pino";
import config from "../config/config.js";

const isProduction = config.nodeEnv === "production";

const baseConfig = {
  level: config.logLevel || "info",
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
  redact: {
    paths: ["password", "token", "*.authorization"],
    censor: "**REDACTED**",
  },
};

const devConfig = {
  transport: {
    target: "pino-pretty",
    options: {
      translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
      ignore: "pid,hostname",
      colorize: true,
    },
  },
};

export default pino({
  ...baseConfig,
  ...(!isProduction && devConfig),
});
