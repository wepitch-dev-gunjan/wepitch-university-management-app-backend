const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    review: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty'
    },
    university: {
      type: Schema.Types.ObjectId,
      ref: 'University'
    }
  },
  {
    timestamps: true
  }
);

module.exports = model("Review", reviewSchema);
