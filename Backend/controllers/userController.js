import User from "../models/User.js";

// Get all users
export const getUsers = async (_, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get single user
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Register new user
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, dateOfBirth } = req.body;

    if (!firstName || !lastName || !email || !dateOfBirth) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({ firstName, lastName, email, password, dateOfBirth });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, dateOfBirth } = req.body;

    if (!firstName || !lastName || !email || !dateOfBirth) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing && existing._id.toString() !== req.params.id) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, dateOfBirth },
      { new: true, runValidators: true, select: "-password" }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
