const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt"); //for encrypting the password data in DB
const jwtManager = require("../../../managers/jwtManager");
const emailManager = require("../../../managers/emailManager");

const register = async (req, res) => {
  const usersModel = mongoose.model("users");
  const { email, password, confirm_password, name, balance } = req.body;

  //validations......
  if (!email) throw new Error("Email must be provided!");
  if (!password) throw new Error("Password must be provided!");
  if (password.length < 5)
    throw new Error("Password must have more than 5 characters");
  if (password != confirm_password)
    throw new Error("Confirmed password and password doesn't match!!");

  const getDupEmail = await usersModel.findOne({
    email: email,
  });
  if (getDupEmail) throw new Error("This email already exists!!"); //new erro() will give the validated custom error messages

  //without await we cannot hash the password
  const hashedPassword = await bcrypt.hash(password, 12); //password is the one which need to be hashed, number of times it should be hashed ie for hacker to encrypt it should be diff(10 to 12 is considered a good number)

  const createdUser = await usersModel.create({
    name: name,
    email: email,
    password: hashedPassword,
    balance: balance,
  });
  const accessToken = jwtManager(createdUser); //centralising the JWT process

  // Looking to send emails in production? Check out our Email API/SMTP product!
  // var transport = nodemailer.createTransport({
  //   host: "sandbox.smtp.mailtrap.io",
  //   port: 2525,
  //   auth: {
  //     user: "101c51bd2d3238",
  //     pass: "617797af20cafd",
  //   },
  // });

  // await transport.sendMail({
  //   to: createdUser.email,
  //   from: "info@expensetracker.com", //dummi email
  //   text: "Welcome to expense tracker PRO. We hope you can manage your expenses easily from our platform!",
  //   html: "<h1>Welcome to expense tracker PRO.</h1> <br/><br/> We hope you can manage your expenses easily from our platform!",
  //   subject: "Welcome to Expense Tracker PRO!",
  // });
  await emailManager(
    //emailManager works this way through a single function no need of those above code
    createdUser.email,
    "Welcome to expense tracker PRO. We hope you can manage your expenses easily from our platform!",
    "<h1>Welcome to expense tracker PRO.</h1> <br/><br/> We hope you can manage your expenses easily from our platform!",
    "Welcome to Expense Tracker PRO!"
  );

  res.status(200).json({
    status: "User registered successfully!",
    accessToken: accessToken,
  });
};

module.exports = register;
