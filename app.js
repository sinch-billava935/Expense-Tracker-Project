const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./modules/users/users.routes");
const transactionRoutes = require("./modules/transactions/transaction.routes");
require("dotenv").config();

const app = express();
app.use(cors()); //api endpoint can be accessed fom anywhere

mongoose
  .connect(process.env.mongo_connection, {})
  .then(() => {
    console.log("MongoDB connection successful");
  })
  .catch(() => {
    console.log("MongoDB connection Failed!!");
  });

//models initialization
require("./models/users.model");
require("./models/transactions.model");

app.use(express.json()); //this is also a kind of middleware that we have used to load the json data fromt he payload

//Routes.........
app.use("/api/users", userRoute);
app.use("/api/transactions", transactionRoutes);

// ❗️Custom 404 handler — this should be AFTER your routes
app.use((req, res) => {
  res.status(404).json({ status: "failed", message: "not found!!" });
});

//gobally handlig errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "failed",
    message: err.message,
  });
});

app.listen(8000, () => {
  console.log("Server started successfully for the Project!!");
});
