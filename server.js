import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import config from "./src/config/config.js";
import firebaseAdmin from "./src/config/firebaseAdminConfig.js";
import patientRoutes from "./src/routes/patientRoutes.js";
import doctorRoutes from "./src/routes/doctorRoutes.js";
import serviceRoutes from "./src/routes/serviceRoutes.js";
import { httpLogger } from "./src/middlewares/logger.middleware.js";
import logger from "./src/util/logger.js";
import errorHandler from "./src/middlewares/errorHandler.middleware.js";

const app = express();

app.use(httpLogger);
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  req.log.info("Test Request");
  res.send("Home");
});

app.use("/api/v1/patients", patientRoutes);
app.use("/api/v1/doctors", doctorRoutes);
app.use("/api/v1/services", serviceRoutes);

app.use(errorHandler);

firebaseAdmin.connectFirebase();

app.listen(config.port, () => {
  logger.info(`Server is running live @ port ${config.port}`);
});
