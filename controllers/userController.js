const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
require("dotenv").config();
const { JWT_SECRET } = process.env;

// Controller to get all users (admin only)
exports.getUsers = async (req, res) => {
  try {
    console.log("Fetching all users");
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to get a single user profile
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to register a new user
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber
    });

    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller for user login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({ user_id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to edit user profile
exports.editProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to handle forgot password functionality
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const token = jwt.sign({ user_id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email with the token (Implementation depends on your email service)
    // await transporter.sendMail({
    //   to: user.email,
    //   from: "no-reply@example.com",
    //   subject: "Password Reset",
    //   html: `<p>You requested for a password reset</p>
    //          <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</p>`
    // });

    res.json({ message: "Password reset token sent to email" });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to reset user password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.query;
    const { newPassword, confirmNewPassword } = req.body;
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.user_id);
    if (!user || user.resetPasswordExpires < Date.now()) return res.status(400).json({ error: "Password reset token is invalid or has expired" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = "";
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to get reviews written by the authenticated user
exports.getUserReviews = async (req, res) => {
  try {
    const userReviews = await Review.find({ studentId: req.user._id }).populate('faculty').populate('university');
    res.json(userReviews);
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
