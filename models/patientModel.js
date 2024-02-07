const realtimeDb = require("../config/firebaseAdminConfig");

class PatientModel {
  static create({
    firstName,
    lastName,
    mobileNumber,
    email,
    patientImageUrl,
    userId,
  }) {
    const newPatientRef = realtimeDb.ref("patients").push();
    newPatientRef.set({
      firstName,
      lastName,
      mobileNumber,
      email,
      patientImageUrl,
      userId,
    });

    return newPatientRef.key;
  }
}

module.exports = PatientModel;

/*
class Patient {
  constructor(patientSchema) {
    this.firstName = patientSchema.firstName;
    this.lastName = patientSchema.lastName;
    this.mobileNumber = patientSchema.mobileNumber;
    this.email = patientSchema.email;
    this.password = patientSchema.password;
  }

  async registerPatientModel() {
    const patientRef = realtimeDb.ref("patients");
    await patientRef.push(this);
  }
}

module.exports = Patient;

*/
