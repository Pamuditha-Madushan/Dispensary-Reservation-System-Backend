import dotenv from "dotenv";
dotenv.config();
import assert from "assert";

const {
  SERVER_PORT,
  HOST,
  HOST_URL,
  REALTIME_DB_URL,
  FIREBASE_STORAGE_URL,
  NODE_ENV,
  LOG_LEVEL,
} = process.env;

assert(SERVER_PORT, "Port is required !");
assert(HOST, "Host is required !");

export default {
  port: SERVER_PORT,
  host: HOST,
  hostUrl: HOST_URL,
  realtimeDbUrl: REALTIME_DB_URL,
  firebaseStorageUrl: FIREBASE_STORAGE_URL,
  nodeEnv: NODE_ENV,
  logLevel: LOG_LEVEL,
};
