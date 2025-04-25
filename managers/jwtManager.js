const jsonwebtoken = require("jsonwebtoken");
//to centralise the JWT process
const jwtManager = (user) => {
  const accessToken = jsonwebtoken.sign(
    //sign() - used to create a valid ID card for further authentication
    {
      _id: user._id,
      name: user.name, //if you have to include any extra field do add it here at once this way making it centralized is useful
    },
    process.env.jwt_salt //without knowing this secret key you cannot access the authentication
  ); //1st param - data content in the virtual ID , 2nd param - secret key fo verifying the ID card

  return accessToken;
};

module.exports = jwtManager;
