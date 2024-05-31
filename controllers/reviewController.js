const Review = require("../models/Review");
const User = require("../models/User");
const Faculty = require("../models/Faculty");
const University = require("../models/University");

// Controller to get all reviews (admin only)
exports.getReviews = async (req, res) => {
  try {
    console.log("Fetching all reviews");
    const reviews = await Review.find().populate('studentId').populate('faculty').populate('university');
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to get a single review
exports.getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('studentId').populate('faculty').populate('university');
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to add a new review
exports.addReview = async (req, res) => {
  try {
    const { review, rating, facultyId, universityId } = req.body;

    // Check if user has already reviewed this faculty or university
    const existingReview = await Review.findOne({
      studentId: req.user._id,
      $or: [{ faculty: facultyId }, { university: universityId }]
    });
    if (existingReview) return res.status(400).json({ error: "You have already reviewed this faculty or university" });

    const newReview = new Review({
      studentId: req.user._id,
      review,
      rating,
      faculty: facultyId,
      university: universityId
    });

    await newReview.save();

    if (facultyId) {
      const faculty = await Faculty.findById(facultyId);
      faculty.reviews.push(newReview._id);
      await faculty.save();
    }

    if (universityId) {
      const university = await University.findById(universityId);
      university.reviews.push(newReview._id);
      await university.save();
    }

    res.json({ message: "Review added successfully" });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to edit a review
exports.editReview = async (req, res) => {
  try {
    const updates = req.body;
    const review = await Review.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json({ message: "Review updated successfully", review });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Controller to delete a review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });

    if (review.faculty) {
      await Faculty.findByIdAndUpdate(review.faculty, { $pull: { reviews: review._id } });
    }

    if (review.university) {
      await University.findByIdAndUpdate(review.university, { $pull: { reviews: review._id } });
    }

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
