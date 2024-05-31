const University = require("../models/University");
const Department = require("../models/Department");
const Faculty = require("../models/Faculty");
const Review = require("../models/Review");

// Controller to get all universities (admin only)
exports.getUniversities = async (req, res) => {
  try {
    console.log("Fetching all universities");
    const universities = await University.find().populate('departments').populate('reviews');
    res.json(universities);
  } catch (error) {
    console.error("Error fetching universities:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to get a single university
exports.getUniversity = async (req, res) => {
  try {
    const university = await University.findById(req.params.id).populate('departments').populate('reviews');
    if (!university) return res.status(404).json({ error: "University not found" });
    res.json(university);
  } catch (error) {
    console.error("Error fetching university:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to register a new university
exports.registerUniversity = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, address } = req.body;
    const existingUniversity = await University.findOne({ email });
    if (existingUniversity) return res.status(400).json({ error: "University already exists" });

    const newUniversity = new University({
      name,
      email,
      password,
      phoneNumber,
      address
    });

    await newUniversity.save();
    res.json({ message: "University registered successfully" });
  } catch (error) {
    console.error("Error registering university:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to edit university details
exports.editUniversity = async (req, res) => {
  try {
    const updates = req.body;
    const university = await University.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!university) return res.status(404).json({ error: "University not found" });
    res.json({ message: "University updated successfully", university });
  } catch (error) {
    console.error("Error updating university:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to delete a university
exports.deleteUniversity = async (req, res) => {
  try {
    const university = await University.findByIdAndDelete(req.params.id);
    if (!university) return res.status(404).json({ error: "University not found" });
    res.json({ message: "University deleted successfully" });
  } catch (error) {
    console.error("Error deleting university:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to get departments of a university
exports.getDepartments = async (req, res) => {
  try {
    const university = await University.findById(req.params.id).populate('departments');
    if (!university) return res.status(404).json({ error: "University not found" });
    res.json(university.departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to get faculty of a department within a university
exports.getFaculty = async (req, res) => {
  try {
    const department = await Department.findById(req.params.departmentId).populate('faculty');
    if (!department) return res.status(404).json({ error: "Department not found" });
    res.json(department.faculty);
  } catch (error) {
    console.error("Error fetching faculty:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to add a review to a university
exports.addReview = async (req, res) => {
  try {
    const { review, rating } = req.body;
    const newReview = new Review({
      studentId: req.user._id,
      review,
      rating,
      university: req.params.id
    });

    await newReview.save();

    const university = await University.findById(req.params.id);
    university.reviews.push(newReview._id);
    await university.save();

    res.json({ message: "Review added successfully" });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to get reviews of a university
exports.getReviews = async (req, res) => {
  try {
    const university = await University.findById(req.params.id).populate('reviews');
    if (!university) return res.status(404).json({ error: "University not found" });
    res.json(university.reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
