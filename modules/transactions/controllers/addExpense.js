const mongoose = require("mongoose");
const validator = require("validator"); // to validate the

const addExpense = async (req, res) => {
  const usersModel = mongoose.model("users");
  const transactionsModel = mongoose.model("transactions");

  const { amount, remarks } = req.body;

  if (!amount) throw new Error("Amount is required!");

  if (!remarks) throw new Error("Remarks is required!");

  if (remarks.length < 5)
    throw new Error("Remarks must be at least 5 characters long!");

  if (!validator.isNumeric(amount.toString()))
    throw new Error("Amount must be a valid number.");

  if (amount < 0) throw new Error("Amount should not be negative");

  await transactionsModel.create({
    user_id: req.user._id,
    amount: amount,
    remarks: remarks,
    transaction: "expense",
  });

  await usersModel.updateOne(
    //to update the data to update the income
    {
      _id: req.user._id,
    },
    {
      $inc: {
        //as there is no dec function so we need to use logic
        balance: amount * -1,
      },
    },
    {
      runValidators: true, //without this validation wont work
    }
  );

  res.status(200).json({
    status: "success",
    message: "Expense added successfully!",
  });
};

module.exports = addExpense;
