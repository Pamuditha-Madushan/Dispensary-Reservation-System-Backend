import express from "express";
import dotenv from "dotenv";
dotenv.config();
import config from "./src/config/config.js";
import firebaseAdmin from "./src/config/firebaseAdminConfig.js";
import patientRoutes from "./src/routes/patientRoutes.js";
import { httpLogger } from "./src/middlewares/logger.middleware.js";
import logger from "./src/util/logger.js";
import errorHandler from "./src/middlewares/errorHandler.middleware.js";
// import dashboardRoutes from "./src/routes/dashboardRoutes"
/* Here is what you need to check firebase-client sdk
import { ref, set } from 'firebase/database'
import { firebaseApp, realtimeDb } from "./config/firebaseClientConfig"
*/

const app = express();

app.use(httpLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  req.log.info("Test Request");
  res.send("Home");
});

/*
app.get("/test-firebase", async (req, res) => {
  const dbRef = ref(realtimeDb, "test-node");
  try {
    await set(dbRef, "Hello, Firebase!");
    res.send("Data written to Firebase Realtime Database successfully");
  } catch (error) {
    res.status(500).send("Error writing data to Firebase Realtime Database");
  }
});

*/

app.use("/api/v1/patients", patientRoutes);

// app.use("/api/dashboard", dashboardRoutes);

app.use(errorHandler);

firebaseAdmin.connectFirebase();

app.listen(config.port, () => {
  logger.info(`Server is running live @ port ${config.port}`);
});
