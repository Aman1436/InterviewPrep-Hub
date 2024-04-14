//for defining the schema

const mongoose = require("mongoose");
//for hashing the password
const bcrypt = require("bcryptjs");
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
      message: (props) => "Email (${props.value}) is invalid!",
    },
  },
  password: {
    type: String,
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
    default: false,
  },
  otp: {
     type:Number,
  },
  otp_expiry_time:{
     type:Date,
  }
});

userSchema.pre("save", async function (next) {
   //We need to run theis function if OTP is actually modified 
   if(!this.isModified("otp")){
      return next();   
   }


   // Hashing the otp with the cost of 12
   this.otp=await bcrypt.hash(this.otp,12);

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



//This name will be used in our database
const User = new mongoose.model("User", userSchema);
module.exports = User;
