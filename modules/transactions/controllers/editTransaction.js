const { default: mongoose } = require("mongoose");
const validator = require("validator");

const editTransaction = async (req, res) => {
  const transactionModel = mongoose.model("transactions");

  const { transaction_id, remarks } = req.body;

  if (!transaction_id) throw new Error("Transaction id is required!");

  if (!validator.isMongoId(transaction_id.toString()))
    throw new Error("Please provide a valid id!");

  const getTransaction = await transactionModel.findOne({
    _id: transaction_id,
  });

  if (!getTransaction) throw new Error("Transaction not found!");

  await transactionModel.updateOne(
    {
      _id: transaction_id,
    },
    {
      remarks,
    },
    {
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "Transaction updated successfully!",
  });
};

module.exports = editTransaction;
