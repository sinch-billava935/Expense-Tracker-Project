const mongoose = require("mongoose");
const validator = require("validator"); // to validate the

const addIncome = async (req, res) => {
  const usersModel = mongoose.model("users");
  const transactionsModel = mongoose.model("transactions");

  const { amount, remarks } = req.body;

  if (!amount) throw "Amount is required!";
  if (!remarks) throw "Remarks is required!";

  if (remarks.length < 5) throw "Remarks must be at least 5 characters long!";

  if (!validator.isNumeric(amount.toString()))
    throw "Amount must be a valid number.";

  if (amount < 0) throw new Error("Amount should not be negative");

  await transactionsModel.create({
    user_id: req.user._id,
    amount: amount,
    remarks: remarks,
    transaction: "income",
  });

  await usersModel.updateOne(
    //to update the data to update the income
    {
      _id: req.user._id,
    },
    {
      $inc: {
        //$inc increement
        balance: amount,
      },
    },
    {
      runValidators: true, //without this validation wont work
    }
  );

  res.status(200).json({
    status: "success",
    message: "Income added successfully!",
  });
};

module.exports = addIncome;
