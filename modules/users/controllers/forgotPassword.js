const { default: mongoose } = require("mongoose");
const emailManager = require("../../../managers/emailManager");

const forgotPassword = async (req, res) => {
  const usersModel = mongoose.model("users");

  const { email } = req.body; //only email is required as to change the password when forgotten

  if (!email) throw new Error("Email is required!");

  const getUser = await usersModel.findOne({
    email: email,
  });

  if (!getUser) throw new Error("This email doesnot exist in the system!");

  const resetCode = Math.floor(10000 + Math.random() * 90000); //the function to create a 5 random numbers as the reset password

  await usersModel.updateOne(
    {
      email: email,
    },
    {
      reset_code: resetCode,
    },
    {
      runValidators: true,
    }
  );

  await emailManager(
    email,
    "Your password reset code is " + resetCode,
    "Your password reset code is " + resetCode,
    "Reset your password - Expense tracker PRO"
  );

  res.status(200).json({
    status: "Reset code sent to email successfully!",
  });
};

module.exports = forgotPassword;
