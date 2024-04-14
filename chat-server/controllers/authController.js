//for using jsonwebtoken
const jwt = require("jsonwebtoken");
//for otp generation
const otpGenerator = require("otp-generator");
const crypto=require("crypto")
const OTP=require("../models/OTP");
const otpGenerator=require("otp-generator");
const {promisify}=require("utils");
const mailSender = require("../utils/mailSender");
//Now performing the CRUD operations

const User = require("../models/user");
// const otp = require("../Templates/Mail/otp");
const resetPassword = require("../Templates/Mail/resetPassword");
const catchAsync = require("../utils/catchAsync");

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
     await User.findOneAndUpdate(
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
exports.sendOTP = catchAsync(async (req, res, next) => {
  const { userId } = req;
  //used the npm package named otp-generator
  const new_otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  //now we need to set the time for expiry of the otp(10 minutes from the time of otp generation)
  const otp_expiry_time = Date.now() + 10 * 60 * 1000;

  const user =await User.findbyIdOneAndUpdate
  (userId, { otp_expiry_time: otp_expiry_time,});

  user.otp = new_otp.toString();
  await user.save({ new: true, validateModifiedOnly: true });
  console.log(new_otp);


  //TODO Sending the email to the user
  // mailService.sendEmail({
  //   from:"aryamanskate01@gmail.com", //enter email verified by sendgrid 
  //   to:"aryamanskate01@gmail.com",
  //   subject: "Verification OTP",
  //   html: otp(user.firstName, new_otp),
  //   attachments: [],
  // })
  
  res.status(200).json({ 
    status: "success", 
    message: "OTP sent successfully"
 });
});

//For verifying the otp and update the user record accordingly
exports.verifyOTP = catchAsync(async (req, res, next) => {
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
  res.status(200).json({ status: "success", 
    message: "OTP verified successfully", 
    token,
    user_id: user._id,
   });
});

exports.login = catchAsync(async (req, res, next) => {
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
  const user = await User.findOne({ email: email }).select("+password");

  //If user not found
  if (!user ||
    !(await user.correctPassword(password, userDoc.password))) {
    return res.status(400).json({ status: "error", 
      message: "Email  or password is incorrect" });
    
  }

  //If user and password matched
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    message: "Logged in successfully!",
    token,
    user_id: user._id,
  });
});

// Making protecting routes
exports.protect=(async(req,res,next)=>{
  //1. Getting token(JWT) and check if its there
  let token;
  
  if(req.headers.authorization && req.headers.authorization.startWith("Bearer")){
    token=req.headers.authorization.split(" ")[1];
  }
  else if(req.cookies.jwt){
    token=req.cookies.jwt;
  }
  if (!token) {
    return res.status(401).json({
      message: "You are not logged in! Please log in to get access.",
    });
  }
  // 2) Verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  console.log(decoded);

  // 3) Check if user still exists

  const this_user = await User.findById(decoded.userId);
  if (!this_user) {
    return res.status(401).json({
      message: "The user belonging to this token does no longer exists.",
    });
  }
  // 4) Check if user changed password after the token was issued
  if (this_user.changedPasswordAfter(decoded.iat)) {
    return res.status(401).json({
      message: "User recently changed password! Please log in again.",
    });
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = this_user;
  next();
});

//Types of routes
  //1. Protected-> only logged in users can access these 
  //2. Unprotected Routes


//For resetting the password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Get the user email
  const user=await User.findOne({email:req.body.email});

  if(!user){
      res.status(400).json({
        status:"error",
        message:"There is no user with given email address"
      });

  }

  //2 Generate Random reset token->with the help of which user can reset the password
  const resetToken=user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //3 Send tocken to the user through email
  //let say our app is having this url
  
  try{
    //Todo-> Send Email with reset url
    const resetURL = `http://localhost:3000/auth/new-password?token=${resetToken}`;
    console.log(resetURL);

    // mailService.sendEmail({
    //   from: "aryamanskate01@gmail.com",
    //   to: user.email,
    //   subject: "Reset Password",
    //   html: resetPassword(user.firstName, resetURL),
    //   attachments: [],
    // });

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




});

exports.resetPassword = async (req, res, next) => {
  // 1 Get the user based on token
  //We will be having token inside the req body

  const hashedToken=crypto.createHash("sha256").update(req.body.token).digest("hex");

  const user=await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {$gt:Date.now()}, //gt->greater than
  });

  //2.If token has expired or submission is out of time window 
  if(!user){
    return res.status(400).json({
      status:"error",
      message:"Token is invalid or expired",
    });
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
       token,
  });
};

//own sendotp
exports.sendotp = async (req, res) => {
	try {
		const { email } = req.body;

		// Check if user is already present
		// Find user with provided email
		const checkUserPresent = await User.findOne({ email });
		// to be used in case of signup

		// If user found with provided email
		if (checkUserPresent) {
			// Return 401 Unauthorized status code with error message
			return res.status(401).json({
				success: false,
				message: `User is Already Registered`,
			});
		}

		var otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});
		const result = await OTP.findOne({ otp: otp });
		console.log("Result is Generate OTP Func");
		console.log("OTP", otp);
		console.log("Result", result);
		while (result) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
			});
		}
		const otpPayload = { email, otp };
		const otpBody = await OTP.create(otpPayload);
        console.log("OTP CREATED");
		console.log("OTP Body", otpBody);
		res.status(200).json({
			success: true,
			message: `OTP Sent Successfully`,
			otp,
		});
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ success: false, error: error.message });
	}
};