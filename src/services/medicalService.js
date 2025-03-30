import firebaseAdmin from "../config/firebaseAdminConfig.js";
import Service from "../models/service.model.js";

class MedicalService {
  static async getSubServicesByServiceType(serviceType) {
    try {
      const snapshot = await firebaseAdmin.fireStore
        .collection("services")
        .doc(serviceType)
        .collection("subServices")
        .get();

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new Error(`Error fetching sub-services for ${serviceType}:`);
    }
  }

  static async findMedicalServicesByDepartment(departmentId) {
    try {
      const deptDoc = await firebaseAdmin.fireStore
        .collection("doctors")
        .doc(departmentId)
        .get();

      if (!deptDoc.exists)
        throw new Error(`Department with ID: ${departmentId} not found.`);

      const departmentData = deptDoc.data();

      if (!departmentData.services || departmentData.services.length === 0)
        return [];

      const serviceTypes = departmentData.services.map((ref) => ref.id || ref);

      const allServices = (
        await Promise.all(
          serviceTypes.map((serviceType) =>
            this.getSubServicesByServiceType(serviceType)
          )
        )
      ).flat();

      return allServices;

      //   const servicesSnapshot = await firebaseAdmin.fireStore
      //     .collection("services")
      //     .where(
      //       firebaseAdmin.fire_store.FieldPath.documentId(),
      //       "in",
      //       serviceIds
      //     )
      //     .get();

      //   if (servicesSnapshot.empty) {
      //     return [];
      //   }

      //   return servicesSnapshot.docs.map((doc) => ({
      //     id: doc.id,
      //     ...doc.data(),
      //   }));
    } catch (error) {
      throw new Error(`Error in find service by department: ${error.message}`);
    }
  }

  static async findMedicalServicesAvailabilityType(serviceType, serviceId) {
    try {
      const serviceRef = await firebaseAdmin.fireStore
        .collection("services")
        .doc(serviceType)
        .collection("subServices")
        .doc(serviceId);
      const serviceSnapshot = await serviceRef.get();
      const serviceData = serviceSnapshot.data();
      return serviceData.availableType;
    } catch (error) {
      throw new Error(
        `Error in find service availability type: ${error.message}`
      );
    }
  }
}

export default MedicalService;
