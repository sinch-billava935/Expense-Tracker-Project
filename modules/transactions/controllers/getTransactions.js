const { default: mongoose } = require("mongoose");

const getTransactions = async (req, res) => {
  const transactionModel = mongoose.model("transactions");

  console.log(req.query); //for additional query handling during the request

  const transactions = await transactionModel.find({
    user_id: req.user._id,
    ...req.query, //... spread operator - it takes out all the content inside of the object and populate it right here
  });

  res.status(200).json({
    status: "success",
    data: transactions,
  });
};

module.exports = getTransactions;
