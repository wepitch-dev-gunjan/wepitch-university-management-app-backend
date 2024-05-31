const Department = require("../models/Department");
const University = require("../models/University");
const Faculty = require("../models/Faculty");

// Controller to get all departments (admin only)
exports.getDepartments = async (req, res) => {
  try {
    console.log("Fetching all departments");
    const departments = await Department.find().populate('faculty').populate('university');
    res.json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to get a single department
exports.getDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate('faculty').populate('university');
    if (!department) return res.status(404).json({ error: "Department not found" });
    res.json(department);
  } catch (error) {
    console.error("Error fetching department:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to register a new department
exports.registerDepartment = async (req, res) => {
  try {
    const { name, universityId } = req.body;
    const existingDepartment = await Department.findOne({ name, university: universityId });
    if (existingDepartment) return res.status(400).json({ error: "Department already exists" });

    const newDepartment = new Department({
      name,
      university: universityId
    });

    await newDepartment.save();
    await University.findByIdAndUpdate(universityId, { $push: { departments: newDepartment._id } });

    res.json({ message: "Department registered successfully" });
  } catch (error) {
    console.error("Error registering department:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to edit department details
exports.editDepartment = async (req, res) => {
  try {
    const updates = req.body;
    const department = await Department.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!department) return res.status(404).json({ error: "Department not found" });
    res.json({ message: "Department updated successfully", department });
  } catch (error) {
    console.error("Error updating department:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to delete a department
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) return res.status(404).json({ error: "Department not found" });
    await University.findByIdAndUpdate(department.university, { $pull: { departments: department._id } });
    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to get faculty members of a department
exports.getFacultyInDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate('faculty');
    if (!department) return res.status(404).json({ error: "Department not found" });
    res.json(department.faculty);
  } catch (error) {
    console.error("Error fetching faculty members:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
