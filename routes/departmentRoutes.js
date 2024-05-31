const express = require("express");
const {
  getDepartment,
  getDepartments,
  registerDepartment,
  editDepartment,
  deleteDepartment,
  getFacultyInDepartment,
} = require("../controllers/departmentController");
const { adminAuth, universityAuth } = require("../middlewares/authMiddlewares");
const router = express.Router();

// Route to get all departments (admin only)
router.get("/departments", adminAuth, getDepartments);

// Route to get a specific department (authenticated university admin)
router.get("/department/:id", universityAuth, getDepartment);

// Route to register a new department (authenticated university admin)
router.post("/department/register", universityAuth, registerDepartment);

// Route to edit a specific department (authenticated university admin)
router.put("/department/:id", universityAuth, editDepartment);

// Route to delete a specific department (admin only)
router.delete("/department/:id", adminAuth, deleteDepartment);

// Route to get faculty members of a specific department (authenticated university admin)
router.get("/department/:id/faculty", universityAuth, getFacultyInDepartment);

module.exports = router;
