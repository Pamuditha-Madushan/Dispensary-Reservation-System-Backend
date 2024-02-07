const admin = require("firebase-admin");
const serviceAccount = require("../simple-medical-booking-app-firebase-adminsdk-j5j36-0cd232bbb7.json");
const config = require("./config");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.realtimeDbUrl,
  storageBucket: config.firebaseStorageUrl,
});

const realtimeDb = admin.database();

module.exports = { realtimeDb, admin };
