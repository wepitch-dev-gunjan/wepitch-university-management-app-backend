const express = require("express");
const {
  getUniversity,
  getUniversities,
  registerUniversity,
  editUniversity,
  deleteUniversity,
  getDepartments,
  getFaculty,
  addReview,
  getReviews,
} = require("../controllers/universityController");
const { adminAuth, universityAuth } = require("../middlewares/authMiddlewares");
const router = express.Router();

// Route to get all universities (admin only)
router.get("/university", adminAuth, getUniversities);

// Route to get a specific university (authenticated university admin)
router.get("/university/:id", universityAuth, getUniversity);

// Route to register a new university
router.post("/university/register", adminAuth, registerUniversity);

// Route to edit a specific university (authenticated university admin)
router.put("/university/:id", universityAuth, editUniversity);

// Route to delete a specific university (admin only)
router.delete("/university/:id", adminAuth, deleteUniversity);

// Route to get departments of a specific university (authenticated university admin)
router.get("/university/:id/departments", universityAuth, getDepartments);

// Route to get faculty of a specific department within a university (authenticated university admin)
router.get("/university/:universityId/departments/:departmentId/faculty", universityAuth, getFaculty);

// Route to add a review to a university (authenticated users)
router.post("/university/:id/review", universityAuth, addReview);

// Route to get reviews of a specific university (authenticated users)
router.get("/university/:id/reviews", universityAuth, getReviews);

module.exports = router;
