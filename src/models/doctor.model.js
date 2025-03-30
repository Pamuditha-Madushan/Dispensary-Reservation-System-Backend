export default class Doctor {
  constructor(id, honorTitle, name, specialization) {
    this.id = id;
    this.honorTitle = honorTitle;
    this.name = name;
    this.specialization = specialization;
  }

  static createDoctorFromFireStore(doc, data) {
    return new Doctor(
      doc.id,
      data.honorTitle,
      `${data.firstName} ${data.lastName}`,
      data.specialization
    );
  }
}
