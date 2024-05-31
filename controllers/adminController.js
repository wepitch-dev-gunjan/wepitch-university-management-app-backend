const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
require("dotenv").config();
const { JWT_SECRET } = process.env;

// Controller to get all admins (super admin only)
exports.getAdmins = async (req, res) => {
  try {
    console.log("Fetching all admins");
    const admins = await Admin.find();
    res.json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to get a single admin profile
exports.getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) return res.status(404).json({ error: "Admin not found" });
    res.json(admin);
  } catch (error) {
    console.error("Error fetching admin:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to register a new admin (super admin only)
exports.registerAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, role } = req.body;
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ error: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      role
    });

    await newAdmin.save();
    res.json({ message: "Admin registered successfully" });
  } catch (error) {
    console.error("Error registering admin:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller for admin login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({ admin_id: admin._id, role: admin.role }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to edit admin profile
exports.editAdmin = async (req, res) => {
  try {
    const updates = req.body;
    const admin = await Admin.findByIdAndUpdate(req.admin._id, updates, { new: true });
    if (!admin) return res.status(404).json({ error: "Admin not found" });
    res.json({ message: "Profile updated successfully", admin });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to delete an admin (super admin only)
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ error: "Admin not found" });
    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
