const { default: mongoose } = require("mongoose");

const userDashboard = async (req, res) => {
  const usersModel = mongoose.model("users");
  const transactionModel = mongoose.model("transactions");

  console.log(req.user);

  const getUser = await usersModel
    .findOne({
      _id: req.user._id,
    })
    .select("name balance email"); //in response we get the object that has id,name,password etc, as we are getting the critical data too in he response we use select() for to handle that
  //also use select("-password") its the same

  const transactions = await transactionModel
    .find({
      user_id: req.user._id,
    })
    .sort("-createdAt") //sort the transactions in descending order
    .limit(5); //max limit we can restrict

  res.status(200).json({
    status: "success",
    data: getUser,
    transactions, //transaction: transactions is also same here
  });
};

module.exports = userDashboard;
