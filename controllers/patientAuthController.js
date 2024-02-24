const { admin } = require("../config/firebaseAdminConfig");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { firebaseApp } = require("../config/firebaseClientConfig");

class patientAuthController {
  static async registerUser(email, password) {
    try {
      const userRecord = await admin.auth().createUser(email, password);
      return userRecord.uid;
    } catch (error) {
      throw new Error("Error creating user: " + error.message);
    }
  }

  static async loginUser({ email, password }) {
    try {
      const auth = getAuth(firebaseApp);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      /* const loginResponse = {
        userId: user.uid,
        email: user.email,
      };

      return loginResponse;

      */
      return user;
    } catch (error) {
      throw new error("Error logging in : " + error.message);
    }
  }
}

module.exports = patientAuthController;
