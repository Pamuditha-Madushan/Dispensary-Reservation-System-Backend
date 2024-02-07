const express = require("express");
const config = require("./config/config");
const patientAuthRoutes = require("./routes/patientAuthRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
/* Here is what you need to check firebase-client sdk
const { ref, set } = require('firebase/database');
const { firebaseApp, realtimeDb } = require("./config/firebaseClientConfig");
*/

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to my server!");
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

app.use("/patients", patientAuthRoutes);

app.use("/dashboard", dashboardRoutes);

app.listen(config.port, () => {
  console.log(`Server is running live @ port ${config.port}`);
});
