const express = require("express");
const {
  getFacultyMember,
  getFacultyMembers,
  registerFacultyMember,
  editFacultyMember,
  deleteFacultyMember,
  getAvailableSlots,
  addReview,
  getReviews,
} = require("../controllers/facultyController");
const { adminAuth, universityAuth, userAuth } = require("../middlewares/authMiddlewares");
const router = express.Router();

// Route to get all faculty members (admin only)
router.get("/faculty", adminAuth, getFacultyMembers);

// Route to get a specific faculty member (authenticated university admin)
router.get("/faculty/:id", universityAuth, getFacultyMember);

// Route to register a new faculty member (authenticated university admin)
router.post("/faculty/register", universityAuth, registerFacultyMember);

// Route to edit a specific faculty member (authenticated university admin)
router.put("/faculty/:id", universityAuth, editFacultyMember);

// Route to delete a specific faculty member (admin only)
router.delete("/faculty/:id", adminAuth, deleteFacultyMember);

// Route to get available slots of a specific faculty member (authenticated users)
router.get("/faculty/:id/slots", userAuth, getAvailableSlots);

// Route to add a review to a faculty member (authenticated users)
router.post("/faculty/:id/review", userAuth, addReview);

// Route to get reviews of a specific faculty member (authenticated users)
router.get("/faculty/:id/reviews", userAuth, getReviews);

module.exports = router;
