const { Schema, model } = require("mongoose");

const doctorSchema = new Schema(
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
    password: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    specialization: {
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
    clinicAddress: {
      type: String,
      required: true
    },
    hospitalAffiliations: {
      type: [String],
      required: true
    },
    consultationFees: {
      type: Number,
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
        patientId: {
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
        }
      }
    ]
  },
  {
    timestamps: true
  },
  {
    strict: false
  }
);

module.exports = model("Doctor", doctorSchema);