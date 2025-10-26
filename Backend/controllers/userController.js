import User from "../models/User.js";


const calculateAge = (dob) => {
  const birthDate = new Date(dob);

  
  if (isNaN(birthDate.getTime())) return -1;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
};

export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, dateOfBirth } = req.body;

    
    if (!firstName || !lastName || !email || !password || !dateOfBirth) {
      return res.status(400).json({ message: "All fields are required" });
    }

   // console.log("DOB received:", dateOfBirth);
    const age = calculateAge(dateOfBirth);
    //console.log("Calculated age:", age);

    if (age < 0) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (age < 18) {
      return res.status(400).json({ message: "User must be at least 18 years old" });
    }

    
    const normalizedEmail = email.toLowerCase().trim();
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    
    const user = await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      password,
      dateOfBirth,
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const getUsers = async (_, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, dateOfBirth } = req.body;

    if (!firstName || !lastName || !email || !dateOfBirth) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const age = calculateAge(dateOfBirth);
    if (age < 0) {
      return res.status(400).json({ message: "Invalid date format" });
    }
    if (age < 18) {
      return res.status(400).json({ message: "User must be at least 18 years old" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing && existing._id.toString() !== req.params.id.toString()) {
      return res.status(400).json({ message: "Email already in use by another user" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email: normalizedEmail, dateOfBirth },
      { new: true, runValidators: true, select: "-password" }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
