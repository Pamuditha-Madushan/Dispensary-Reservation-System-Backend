import firebaseAdmin from "../config/firebaseAdminConfig.js";
import Doctor from "../models/doctor.model.js";

class DoctorService {
  static async findDoctorsBySpecialization(departmentId, specialization) {
    try {
      const doctorRef = await firebaseAdmin.fireStore
        .collection("doctors")
        .doc(departmentId)
        .collection(specialization);
      const querySnapshot = await doctorRef.get();

      // const doctors = [];
      // querySnapshot.forEach((doc) => {
      //   const data = doc.data();
      //   const doctor = new Doctor(
      //     doc.id,
      //     data.honorTitle,
      //     data.firstName + " " + data.lastName,
      //     data.specialization
      //   );
      //   doctors.push(doctor);
      // });

      // return doctors;

      return querySnapshot.docs.map((doc) =>
        Doctor.createDoctorFromFireStore(doc, doc.data())
      );
    } catch (error) {
      throw new Error(
        `Error in find doctor by specialization: ${error.message}`
      );
    }
  }

  static async findDoctorAvailability(departmentId, specialization, doctorId) {
    try {
      const doctorRef = await firebaseAdmin.fireStore
        .collection("doctors")
        .doc(departmentId)
        .collection(specialization)
        .doc(doctorId);
      const doctorSnapshot = await doctorRef.get();
      const doctorData = doctorSnapshot.data();
      return doctorData.availability || [];
    } catch (error) {
      console.error(`Error in find doctor availability: ${error.message}`);
      throw new Error(`Error in find doctor availability: ${error.message}`);
    }
  }
}

export default DoctorService;
