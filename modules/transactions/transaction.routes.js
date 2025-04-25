const express = require("express");

const auth = require("../../middleware/auth");
const addIncome = require("./controllers/addIncome");
const addExpense = require("./controllers/addExpense");
const getTransactions = require("./controllers/getTransactions");
const deleteTransaction = require("./controllers/deleteTransaction.js");
const editTransaction = require("./controllers/editTransaction.js");
const transactionRoutes = express.Router(); //using Router() we can create custom routes

//Routes.........

transactionRoutes.use(auth); //using auth middleware, now everything below this LOC is controled by auth middleware

//Protected Routes.....(After auth middleware)
transactionRoutes.post("/addIncome", addIncome);
transactionRoutes.post("/addExpense", addExpense);
transactionRoutes.get("/", getTransactions);
transactionRoutes.delete("/:transaction_id", deleteTransaction);
transactionRoutes.patch("/", editTransaction);
module.exports = transactionRoutes;
