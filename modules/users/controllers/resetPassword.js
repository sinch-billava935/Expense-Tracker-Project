const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const emailManager = require("../../../managers/emailManager");

const resetPassword = async (req, res) => {
  const usersModel = mongoose.model("users");

  const { email, new_password, reset_code } = req.body; //for reset we need 3 fields

  if (!email) throw new Error("Email is required");
  if (!new_password) throw new Error("Please provide new password!");
  if (!reset_code) throw new Error("Reset code is required!");
  if (new_password.length < 5)
    throw new Error("Password must be at least 5 characters long!");

  const getUserWithResetCode = await usersModel.findOne({
    email: email,
    reset_code: reset_code,
  });

  if (!getUserWithResetCode) throw new Error("Reset code does not match!");

  const hashedPassword = await bcrypt.hash(new_password, 12);

  await usersModel.updateOne(
    {
      email: email,
    },
    {
      password: hashedPassword,
      reset_code: "", //this is because when you reset the password and still the reset code should not be there in the DB
    },
    {
      runValidators: true,
    }
  );

  await emailManager(
    email,
    "Your password is reseted successfully! If you have not done that, please contact us!",
    "Your password is reseted successfully! If you have not done that, please contact us!",
    "Password reset successfully!"
  );

  res.status(200).json({
    status: "success",
    message: "Password reseted succesfully!",
  });
};

module.exports = resetPassword;



