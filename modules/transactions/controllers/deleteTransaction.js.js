const { default: mongoose } = require("mongoose");
const validator = require("validator"); //to validate the transaction_id in the postman deleteTransaction route

const deleteTransaction = async (req, res) => {
  const transactionModel = mongoose.model("transactions");
  const usersModel = mongoose.model("users");

  const { transaction_id } = req.params;

  if (!validator.isMongoId(transaction_id.toString()))
    throw new Error("Please provide a valid id!"); //to allow only the valid mongoID in the deletetransaction route in postman

  const getTransaction = await transactionModel.findOne({
    _id: transaction_id,
  });

  if (!getTransaction) throw new Error("Transaction not found!");

  console.log(getTransaction);

  if (getTransaction.transaction_type === "income") {
    // income logic here
    await usersModel.updateOne(
      {
        _id: getTransaction.user_id,
      },
      {
        $inc: {
          //when income must be deleted from the amount as we have deleted the transaction
          balance: getTransaction.amount * -1,
        },
      },
      {
        runValidators: true,
      }
    );
  } else {
    // expense logic here

    await usersModel.updateOne(
      //
      {
        _id: getTransaction.user_id,
      },
      {
        $inc: {
          //we need to increase the amount as the transaction of expense is deleted
          balance: getTransaction.amount,
        },
      },
      {
        runValidators: true,
      }
    );
  }

  await transactionModel.deleteOne({
    _id: transaction_id,
  });

  res.status(200).json({
    status: "Deleted successfully!",
  });
};

module.exports = deleteTransaction;
