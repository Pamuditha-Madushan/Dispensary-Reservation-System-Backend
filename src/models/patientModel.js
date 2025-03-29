import firebaseAdmin from "../config/firebaseAdminConfig.js";

class PatientModel {
  static create(patientData) {
    const newPatientRef = firebaseAdmin.realtimeDb.ref("patients").push();
    const patientWithDefaultState = {
      ...patientData,
      loggedOut: false,
      lastPasswordReset: "",
      createdAt: new Date().toISOString(),
    };
    newPatientRef.set(patientWithDefaultState);
    return newPatientRef.key;
  }

  static async getPatientDataByUserId(userId) {
    const patientRef = firebaseAdmin.realtimeDb
      .ref("patients")
      .orderByChild("userId")
      .equalTo(userId);
    const snapshot = await patientRef.once("value");
    if (snapshot.exists()) {
      const patientData = snapshot.val();
      const patientKey = Object.keys(patientData)[0];
      return { ...patientData[patientKey], key: patientKey };
    }

    return null;
    // return snapshot.exists ? snapshot.val() : null;
  }

  static async getPatientNameByEmail(email) {
    const patientRef = firebaseAdmin.realtimeDb
      .ref("patients")
      .orderByChild("email")
      .equalTo(email);

    const snapshot = await patientRef.once("value");
    if (snapshot.exists()) {
      const patients = snapshot.val();
      const patientId = Object.keys(patients)[0];
      return patients[patientId].firstName;
    } else return null;
  }

  static async updateLogoutState(userId, state) {
    const patientRef = firebaseAdmin.realtimeDb
      .ref("patients")
      .orderByChild("userId")
      .equalTo(userId);

    const snapshot = await patientRef.once("value");
    if (snapshot.exists()) {
      const patientKey = Object.keys(snapshot.val())[0];
      await firebaseAdmin.realtimeDb
        .ref(`patients/${patientKey}/loggedOut`)
        .set(state);
      return true;
    }
    return false;
  }

  static async getPatientKeyByUserId(userID) {
    const patientRef = await firebaseAdmin.realtimeDb
      .ref("patients")
      .orderByChild("userId")
      .equalTo(userID);
    const snapshot = await patientRef.once("value");
    if (snapshot.exists()) {
      const patientId = Object.keys(snapshot.val())[0];
      return patientId;
    }
    return null;
  }

  static async updateLastPasswordReset(patientId) {
    await firebaseAdmin.realtimeDb
      .ref(`patients/${patientId}/lastPasswordReset`)
      .set(new Date().toISOString());
  }

  static async canResetPassword(patientId) {
    const snapshot = await firebaseAdmin.realtimeDb
      .ref(`patients/${patientId}/lastPasswordReset`)
      .once("value");
    const lastReset = snapshot.val();

    if (!lastReset) return true;

    const now = new Date();
    const lastPasswordReset = new Date(lastReset);
    const differentInDays = Math.floor(
      (now - lastPasswordReset) / (1000 * 60 * 60 * 24)
    );

    return differentInDays >= 7;
  }

  static async sendPasswordResetEmail(email) {
    return firebaseAdmin.auth.generatePasswordResetLink(email);
  }

  static async sendEmailVerification(email) {
    return firebaseAdmin.auth.generateEmailVerificationLink(email);
  }

  static async isEmailVerified(userId) {
    const userRecord = await firebaseAdmin.auth.getUser(userId);
    return userRecord.emailVerified;
  }

  static async updatePatient(patientId, patientData) {
    const patientRef = await firebaseAdmin.realtimeDb.ref(
      `patients/${patientId}`
    );
    await patientRef.update(patientData);
  }

  static async getPatientDataById(patientId) {
    const snapshot = await firebaseAdmin.realtimeDb
      .ref(`patients/${patientId}`)
      .once("value");
    if (snapshot.exists()) return snapshot.val();
    else return null;
  }
}

export default PatientModel;
