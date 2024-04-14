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
});

userSchema.methods.correctPassword = async function (
  candidatePassword,//password suppied by the user
  userPassword//password stored in the database
){
  return await bcrypt.compare(candidatePassword,userPassword)
}



//This name will be used in our database
const User = new mongoose.model("User", userSchema);
module.exports = User;
