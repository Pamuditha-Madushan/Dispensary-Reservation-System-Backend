import firebaseAdmin from "../config/firebaseAdminConfig.js";

class PatientModel {
  static create(patientData) {
    const newPatientRef = firebaseAdmin.realtimeDb.ref("patients").push();
    newPatientRef.set(patientData);
    return newPatientRef.key;
  }

  static async getUserById(userId) {
    const patientRef = firebaseAdmin.realtimeDb
      .ref("patients")
      .orderByChild("userId")
      .equalTo("userId");
    const snapshot = await patientRef.once("value");
    return snapshot.val();
  }
}

export default PatientModel;
