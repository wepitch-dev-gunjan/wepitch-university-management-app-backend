const { Schema, model } = require("mongoose");

const facultySchema = new Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    qualifications: {
      type: [String],
      required: true
    },
    experience: {
      type: Number, // Number of years
      required: true
    },
    availableSlots: [
      {
        day: {
          type: String,
          required: true
        },
        startTime: {
          type: String,
          required: true
        },
        endTime: {
          type: String,
          required: true
        }
      }
    ],
    profilePicture: {
      type: String
    },
    ratings: {
      type: Number,
      default: 0
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review'
      }
    ],
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = model("Faculty", facultySchema);
