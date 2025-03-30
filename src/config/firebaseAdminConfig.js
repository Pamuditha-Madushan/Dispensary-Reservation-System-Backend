import admin from "firebase-admin";
import config from "./config.js";
import logger from "../util/logger.js";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;

const connectFirebase = async () => {
  if (!serviceAccount) {
    logger.error(
      "FIREBASE_SERVICE_ACCOUNT is not defined in the environment variables!"
    );
    process.exit(1);
  }
};

try {
  // const serviceAccountContent = JSON.parse(serviceAccount);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.realtimeDbUrl,
    storageBucket: config.firebaseStorageUrl,
  });

  logger.info("Connected to Firebase Admin SDK successfully.");
} catch (error) {
  logger.error(`Firebase Admin SDK connection error: ${error.message}`);
  process.exit(1);
}

export default {
  connectFirebase,
  realtimeDb: admin.database(),
  auth: admin.auth(),
  storage: admin.storage(),
  fireStore: admin.firestore(),
  fire_store: admin.firestore,
};
