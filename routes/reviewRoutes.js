const express = require("express");
const {
  getReview,
  getReviews,
  addReview,
  editReview,
  deleteReview,
} = require("../controllers/reviewController");
const { userAuth, adminAuth } = require("../middlewares/authMiddlewares");
const router = express.Router();

// Route to get all reviews (admin only)
router.get("/reviews", adminAuth, getReviews);

// Route to get a specific review (authenticated users)
router.get("/review/:id", userAuth, getReview);

// Route to add a new review (authenticated users)
router.post("/review", userAuth, addReview);

// Route to edit a specific review (authenticated users)
router.put("/review/:id", userAuth, editReview);

// Route to delete a specific review (admin only)
router.delete("/review/:id", adminAuth, deleteReview);

module.exports = router;
