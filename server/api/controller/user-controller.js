const User = require("../models/user-model");
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    if (!users) throw new Error("No users found");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select("-password");
    if (!user)
      return res
        .status(400)
        .json({ msg: "The requested user id doesnot exist." });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
const editUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, address, username } = req.body;
    const user = await User.findById(id).select("-password");
    if (!user)
      return res
        .status(400)
        .json({ msg: "The requested user id doesnot exist." });
    const isUpdated = await User.findByIdAndUpdate(id, {
      name,
      address,
      username,
    });
    if (!isUpdated) throw new Error("Server error. Couldnot update user");
    res.status(200).json({ msg: "User updated successfully;" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
const deleteUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select("-password");
    if (!user)
      return res
        .status(400)
        .json({ msg: "The requested user id doesnot exist." });
    const isDeleted = await User.findByIdAndDelete(id);

    if (!isDeleted) throw new Error("Server Error.Couldnot delete user.");
    res.status(200).json({ msg: "User Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
const addUser = async (req, res) => {
  try {
    const { name, address, username, password } = req.body;
    if (!name || !address || !username || !password) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    //Check for existing user
    const user = await User.findOne({ username });
    if (user) return res.status(400).json({ msg: "User already exists" });

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
module.exports = {
  getAllUsers,
  getUserById,
  editUserById,
  deleteUserById,
  addUser,
};
