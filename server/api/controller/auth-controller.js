const User = require("../models/user-model");
const dotenv = require("dotenv")
dotenv.config();
const jwt = require('jsonwebtoken')
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }
    // Check for existing user
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "User deoesnot exist" });

    // Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Sign jsonwebtoken
    const token = await user.generateAuthToken();
    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        address : user.address,
        role : user.role
      },
      msg : "Logged In successfully"
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const register = async (req, res) => {
  try {
    const { name, address, username, password } = req.body;
    if (!name || !address || !username || !password) {
      throw new Error("Please enter all fields");
    }

    //Check for existing user
    const user = await User.findOne({ username });
    if (user) throw new Error("User already exists");

    // Create hashed password
    const newUser = new User({
      name,
      address,
      username,
    });
    const hash = await newUser.hashPassword(password);
    newUser.password = hash;

    await newUser.save();
    res.status(200).json({ msg: "User created Successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decodedToken.id });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json({user});
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  login,
  register,
  getUser
};
