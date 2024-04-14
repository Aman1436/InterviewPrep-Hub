//for using jsonwebtoken
const jwt = require("jsonwebtoken");
//for otp generation
const otpGenerator = require("otp-generator");

//Now performing the CRUD operations

const User = require("../models/user");

//defining the sign token function
const signToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET);

//Register New User
//collecting the data during registaration from the body
exports.register = async (req, res, next) => {
  const { firstName, lastName, email, password, verified } = req.body;

  const filteredBody = filterObj(
    req.body,
    "firstName",
    "lastName",
    "email",
    "password"
  );

  // check if a verified user with given email address
  //We will be sending otp for verification

  //If user with the same email address already exists,we will throw a error message
  const existing_user = await User.findOne({ email: email });
  //if user already exists and already done verification using otp
  if (existing_user && existing_user.verified) {
    return res
      .status(400)
      .json({
        status: "error",
        message: "User with this email already exists.Please login.",
      });
  }
  //if user already exists and not done verification using otp
  else if (existing_user) {
    const updated_user = await User.findOneAndUpdate(
      { email: email },
      filteredBody,
      { new: true, validateModifiedOnly: true }
    );

    //pass the control to next middleware
    req.userId = existing_user._id;
    next();
  } else {
    //if user record is not found in the database
    //We need to create new user record
    const new_user = await User.create(filteredBody);

    //generate the otp and send email to the user
    req.userId = new_user._id;
    next();
  }
};

//for sending the otp
exports.sendOTP = async (req, res, next) => {
  const { userId } = req;
  //used the npm package named otp-generator
  const new_otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  //now we need to set the time for expiry of the otp(10 minutes from the time of otp generation)
  const otp_expiry_time = Date.now() + 10 * 60 * 1000;

  await User.findbyIdOneAndUpdate(userId, { otp: new_otp, otp_expiry_time });

  //TODO Sending the email to the user

  res.status(200).json({ status: "success", message: "OTP sent successfully" });
};

//For verifying the otp and update the user record accordingly
exports.verifyOTP = async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await User.findOne({
    email: email,
    otp_expiry_time: { $gt: Date.now() },
  });

  if (!user) {
    res
      .status(400)
      .json({
        status: "error",
        message: "Email is invalid or OTP has expired",
      });
  }

  //We will also store the otp in the DB in the hash format
  //Then we need to compare the otps

  //If userOTP is incorrect
  if (!(await user.correctOTP(otp, user.otp))) {
    res.status(400).json({ status: "error", message: "OTP is incorrect" });
  }

  //If userOTP is correct

  user.verified = true;
  user.otp = undefined;

  await user.save({ new: true, validateModifiedOnly: true });

  const token = signToken(user._id);
  res
    .status(200)
    .json({ status: "success", message: "OTP verified successfully", token });
};

exports.login = async (req, res, next) => {
  //getting the email and password from the request body

  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({
        status: "error",
        message: "Both email and password are required",
      });
  }
  //Finding the user in the database from the username and password provided
  const userDoc = await User.findOne({ email: email }).select("+password");

  //If user not found
  if (
    !userDoc ||
    !(await userDoc.correctPassword(password, userDoc.password))
  ) {
    return res
      .status(400)
      .json({ status: "error", message: "Email  or password is incorrect" });
  }

  //If user and password matched
  const token = signToken(userDoc._id);
  res
    .status(200)
    .json({
      status: "success",
      message: "Logged in successfully",
      data: { token },
    });
};

//For resetting the password
exports.forgotPassword = async (req, res, next) => {};

exports.resetPassword = async (req, res, next) => {};
