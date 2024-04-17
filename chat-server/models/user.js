//for defining the schema

const mongoose = require("mongoose");
//for hashing the password
const bcrypt = require("bcryptjs");
const crypto=require("crypto");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name is required"],
  },
  avatar: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: {
      // function which is validating whether the email is valid or not
      validator: function (email) {
        return String(email)
          .toLowerCase()
          .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      },
      message: (props) => `Email (${props.value}) is invalid!`,
    },
  },
  password: {
    type: String,
  },
  passwordConfirm:{
    type:String,
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetExpires: {
    type: Date,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
  verified: {
    type: Boolean,
    // default: false, changin by default to verified=true
    default: true,
  },
  otp: {
     type:Number,
  },
  otp_expiry_time:{
     type:Date,
  },
  socket_id:{
    type:String,
  },
  friends:[
    {
      type:mongoose.Schema.ObjectId,
      ref:"User",
    }
  ]
});

userSchema.pre("save", async function (next) {
   //We need to run theis function if OTP is actually modified 
   if(!this.isModified("otp") || !this.otp ){
      return next();   
   }


   // Hashing the otp with the cost of 12
   this.otp=await bcrypt.hash(this.otp.toString(),12);
   console.log(this.otp.toString(), "FROM PRE SAVE HOOK");

   next();
})

//Decrypting password passed by the user in reset password link
userSchema.pre("save", async function (next) {
  if(!this.isModified("password") || !this.password){
     return next();   
  }
  this.password=await bcrypt.hash(this.password,12);

  next();
})



//for comparing the password entered and that in the DB in the encrypted format
userSchema.methods.correctPassword = async function (
  candidatePassword,//password suppied by the user
  userPassword//password stored in the database
){
  return await bcrypt.compare(candidatePassword,userPassword)
}

//for comparing the otp entered and that in the DB in the encrypted format
userSchema.methods.correctOTP = async function (
   candidateOTP,//password suppied by the user
   userOTP//password stored in the database
 ){
   return await bcrypt.compare(candidateOTP,userOTP)
 }
 
//We are not creating arrow function as in arrow function this keyword does not work
 userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimeStamp;
  }

  // FALSE MEANS NOT CHANGED
  return false;
};

userSchema.methods.createPasswordResetToken=function(){
  // using crypto to generate random string
  const resetToken=crypto.randomBytes(32).toString("hex");
  //store resetToken in user schema
  //sha246 is the hashing algorithm
  this.passwordResetToken=crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetExpires=Date.now()+10*60*1000;//10min expiry time


  return resetToken;
};



//This name will be used in our database
const User = new mongoose.model("User", userSchema);
module.exports = User;
