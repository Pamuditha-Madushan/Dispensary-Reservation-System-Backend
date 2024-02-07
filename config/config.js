const dotenv = require("dotenv");
const assert = require("assert");

dotenv.config();

const {
  SERVER_PORT,
  HOST,
  HOST_URL,
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID,
  REALTIME_DB_URL,
  FIREBASE_STORAGE_URL,
} = process.env;

assert(SERVER_PORT, "Port is required !");
assert(HOST, "Host is required !");

module.exports = {
  port: SERVER_PORT,
  host: HOST,
  hostUrl: HOST_URL,
  firebaseConfig: {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
    measurementId: MEASUREMENT_ID,
  },
  realtimeDbUrl: REALTIME_DB_URL,
  firebaseStorageUrl: FIREBASE_STORAGE_URL,
};
