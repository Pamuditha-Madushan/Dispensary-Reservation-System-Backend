const { realtimeDb } = require("../config/firebaseAdminConfig");

class DashboardController {
  static async retrievePatientInfo(req, res) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(404).send({
          statusCode: 404,
          success: false,
          error: "User Id is not provided !",
        });
      }

      /* const patientInfoRecord = await realtimeDb
        .ref("patients")
        .child(userId)
        .get();

        */

      const patientRef = await realtimeDb.ref("patients");
      patientRef
        .orderByChild("userId")
        .equalTo(userId)
        .once("value", (snapshot) => {
          if (!snapshot.exists) {
            return res.status(404).send({
              statusCode: 404,
              success: false,
              error: "No patient record found !",
            });
          }

          const patientInfoRecord = snapshot.val();

          return res.status(201).json({
            statusCode: 201,
            success: true,
            message:
              "Patient info for user id : " +
              userId +
              " is retrieved successfully ...",
            data: {
              patientInfoRecord,
            },
          });
        });
    } catch (error) {
      return res.status(500).send({
        statusCode: 500,
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = DashboardController;
