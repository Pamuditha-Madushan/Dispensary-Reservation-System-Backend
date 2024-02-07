const { admin } = require("../config/firebaseAdminConfig");

const verifyAccessToken = async (req, res, next) => {
  const accessToken = req.headers["authorization"];

  if (!accessToken) {
    return res.status(401).send({
      statusCode: 401,
      success: false,
      error: "Access token not provided",
    });
  }

  try {
    /*
 if (accessToken !== `Bearer ${validAccessToken}`) {
    return res.status(403).send({
      statusCode: 403,
      success: false,
      error: "Invalid access token",
    });
  }

  */

    const decodedToken = await admin
      .auth()
      .verifyIdToken(accessToken.split(" ")[1]);

    // Attach the decoded token to the request for further use in the route handler
    req.user = decodedToken;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(403).send({
      statusCode: 403,
      success: false,
      error: "Invalid access token",
    });
  }
};

module.exports = verifyAccessToken;
