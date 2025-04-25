const jsonwebtoken = require("jsonwebtoken"); //use tis to verify our code

const auth = async (req, res, next) => {
  //   console.log("Hello from the middleware!");
  //   //if I dont want the below part of the auth LOC to be excetuded simply throwing exception and commenting out next() function would work
  //   throw new Error("Can't do this now!");
  //console.log(req.headers);
  try {
    const accessToken = req.headers.authorization.replace("Bearer ", "");

    const jwt_payload = jsonwebtoken.verify(accessToken, process.env.jwt_salt);
    req.user = jwt_payload; //creating a user object inside the request which holds the value payload
    // console.log(jwt_payload);
  } catch (e) {
    // Custom response for invalid token or signature
    res.status(401).json({
      status: "failed",
      message: "Unauthorized!",
    });
    return;
  }
  next();
};

module.exports = auth;
