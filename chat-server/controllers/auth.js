//for using jsonwebtoken
const jwt = require("jsonwebtoken");
//for otp generation
const otpGenerator = require("otp-generator");
const crypto=require("crypto")
const {promisify}=require("utils");

//Now performing the CRUD operations

const User = require("../models/user");
const { restart } = require("nodemon");

//defining the sign token function
const signToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET);

//Signup= register- sentOTP-verifyOtp

//for registering there would be some api ex: https://api.tawk.com/auth/register


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

// Making protecting routes
exports.protect=async(req,res,next)=>{
  //1. Getting token(JWT) and check if its there
  let token;
  
  if(req.headers.authorization && req.headers.authorization.startWith("Bearer")){
    token=req.headers.authorization.split(" ")[1];


  }
  else if(req.cookies.jwt){
    token=req.cookies.jwt;
  }
  else{
    res.status(400).json({
      status:"error",
      message:"You are not logged in, Please log in to get access"
    });
    return;
  }

  //2. Verification of token
  const decoded=await promisify(jwt.verify)(token,process.env.JWT_SECRET);

  //3. Check if user still exist
  const this_user=await User.findById(decoded.userId);

  if(!this_user){
    res.status(400).json({
      status:"error",
      message:"The user doesn't exist",
    })
  }

  //4. Check if user change their password after token was issued
  //iat ->contain the time when the token was issued
  if(this_user.changePasswordAfter(decoded.iat)){
    res.status(400).json({
      status:"error",
      message:"User recently updated password! Please log in again",
    })
  }


  req.user=this_user;
  //passing to the next middleware
  next();
};

//Types of routes
  //1. Protected-> only logged in users can access these 
  //2. Unprotected Routes


//For resetting the password
exports.forgotPassword = async (req, res, next) => {
  // 1. Get the user email
  const user=await User.findOne({email:req.body.email});

  if(!user){
      res.status(400).json({
        status:"error",
        message:"There is no user with given email address"
      });
      return;

  }

  //2 Generate Random reset token->with the help of which user can reset the password
  const resetToken=user.createPasswordResetToken();
  
  //3 Send tocken to the user through email
  //let say our app is having this url
  const resetURL=`https://tawk.com/auth/reset-password/?code${resetToken}`;
  
  try{
      //Todo-> Send Email with reset url
      res.status(200).json({
        status:"success",
        message:"Reset Password link sent to Email",
      })
  }
  catch(error){
    user.passwordResetToken=undefined;
    user.passwordResetExpires=undefined;

    await user.save({validateBeforeSave:false});
    res.status(500).json({
      status:"error",
      message:"There was an error sending the email, Please try again later",
    })
  }




};

exports.resetPassword = async (req, res, next) => {
  // 1 Get the user based on token
  //We will be having token inside the req body

  const hashedToken=crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user=await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {$gt:Date.now()}, //gt->greater than
  });

  //2.If token has expired or submission is out of time window 
  if(!user){
    res.status(400).json({
      status:"error",
      message:"Token is invalid or expired",
    });
    return;
  }
  //3 Update user password and set resetToken and expiry to undefined
  user.password=req.body.password;
  user.passwordConfirm=req.body.passwordConfirm

  user.passwordResetToken=undefined;
  user.passwordResetExpires=undefined;

  //Saving the data
  await user.save();

  // 4. Log in the user and send new JWT

  //Todo-> send an email to user informing about password reset 


  const token = signToken(user._id);
  res.status(200).json({ 
      status: "success",
       message: "Password Reseted Successfully", 
       token
  });





};
