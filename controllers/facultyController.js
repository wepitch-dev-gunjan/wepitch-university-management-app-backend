const Faculty = require("../models/Faculty");
const Department = require("../models/Department");
const Review = require("../models/Review");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

// Controller to get all faculty members (admin only)
exports.getFacultyMembers = async (req, res) => {
  try {
    console.log("Fetching all faculty members");
    const facultyMembers = await Faculty.find().populate('department').populate('reviews');
    res.json(facultyMembers);
  } catch (error) {
    console.error("Error fetching faculty members:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to get a single faculty member
exports.getFacultyMember = async (req, res) => {
  try {
    const facultyMember = await Faculty.findById(req.params.id).populate('department').populate('reviews');
    if (!facultyMember) return res.status(404).json({ error: "Faculty member not found" });
    res.json(facultyMember);
  } catch (error) {
    console.error("Error fetching faculty member:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to register a new faculty member
exports.registerFacultyMember = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, qualifications, experience, departmentId } = req.body;
    const existingFacultyMember = await Faculty.findOne({ email });
    if (existingFacultyMember) return res.status(400).json({ error: "Faculty member already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newFacultyMember = new Faculty({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      qualifications,
      experience,
      department: departmentId
    });

    await newFacultyMember.save();
    await Department.findByIdAndUpdate(departmentId, { $push: { faculty: newFacultyMember._id } });

    res.json({ message: "Faculty member registered successfully" });
  } catch (error) {
    console.error("Error registering faculty member:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to edit faculty member details
exports.editFacultyMember = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const facultyMember = await Faculty.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!facultyMember) return res.status(404).json({ error: "Faculty member not found" });
    res.json({ message: "Faculty member updated successfully", facultyMember });
  } catch (error) {
    console.error("Error updating faculty member:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to delete a faculty member
exports.deleteFacultyMember = async (req, res) => {
  try {
    const facultyMember = await Faculty.findByIdAndDelete(req.params.id);
    if (!facultyMember) return res.status(404).json({ error: "Faculty member not found" });
    await Department.findByIdAndUpdate(facultyMember.department, { $pull: { faculty: facultyMember._id } });
    res.json({ message: "Faculty member deleted successfully" });
  } catch (error) {
    console.error("Error deleting faculty member:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to get available slots of a faculty member
exports.getAvailableSlots = async (req, res) => {
  try {
    const facultyMember = await Faculty.findById(req.params.id);
    if (!facultyMember) return res.status(404).json({ error: "Faculty member not found" });
    res.json(facultyMember.availableSlots);
  } catch (error) {
    console.error("Error fetching available slots:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to add a review to a faculty member
exports.addReview = async (req, res) => {
  try {
    const { review, rating } = req.body;
    const newReview = new Review({
      studentId: req.user._id,
      review,
      rating,
      faculty: req.params.id
    });

    await newReview.save();

    const facultyMember = await Faculty.findById(req.params.id);
    facultyMember.reviews.push(newReview._id);
    await facultyMember.save();

    res.json({ message: "Review added successfully" });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to get reviews of a faculty member
exports.getReviews = async (req, res) => {
  try {
    const facultyMember = await Faculty.findById(req.params.id).populate('reviews');
    if (!facultyMember) return res.status(404).json({ error: "Faculty member not found" });
    res.json(facultyMember.reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
