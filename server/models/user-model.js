const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role : {
    type : String,
    enum : ['admin', 'user'],
    default : 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Method of instance of user model to hashPassword
UserSchema.methods.hashPassword = async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (err) {
    throw new Error("cannot hash password");
  }
};

// Method of instance of user model to comparePassword
UserSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method of instance of user model to generate JSON web token
UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: 3600000,
  });
  return token;
};

const User = mongoose.model("user", UserSchema);
module.exports = User;
