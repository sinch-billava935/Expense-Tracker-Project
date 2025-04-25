const express = require("express");
const register = require("./controllers/register");
const login = require("./controllers/login");
const auth = require("../../middleware/auth");
const userDashboard = require("./controllers/userDashboard");
const forgotPassword = require("./controllers/forgotPassword");
const resetPassword = require("./controllers/resetPassword");
const userRoute = express.Router(); //using Router() we can create custom routes

//Routes.........
userRoute.post("/register", register);
userRoute.post("/login", login);
userRoute.post("/forgotpw", forgotPassword);
userRoute.post("/resetpw", resetPassword);

userRoute.use(auth); //using auth middleware, now everything below this LOC is controled by auth middleware

//Protected Routes.....(After auth middleware)
userRoute.get("/dashboard", userDashboard);

module.exports = userRoute;
