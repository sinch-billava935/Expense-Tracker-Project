const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const jwtManager = require("../../../managers/jwtManager");

const login = async (req, res) => {
  const usersModel = mongoose.model("users");

  const { email, password } = req.body; //for validation user needs email and password

  const getUser = await usersModel.findOne({
    //if the entered email is not in the DB
    email: email,
  });
  if (!getUser) throw new Error("This email does not exist in the system");

  const comparePassword = await bcrypt.compare(password, getUser.password); //the string the we are comparing ie password, encrypted string
  if (!comparePassword) throw new Error("Email and password do not match");

  const accessToken = jwtManager(getUser); //centralising the JWT process
  //success response
  res.status(200).json({
    status: "Success",
    message: "User logged in successfully!!",
    accessToken: accessToken, //to access the authentication
  });
};

module.exports = login;
