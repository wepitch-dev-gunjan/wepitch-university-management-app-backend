const { Schema, model } = require("mongoose");

const universitySchema = new Schema(
  {
    name: {
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
    address: {
      type: String,
      required: true
    },
    profilePicture: {
      type: String
    },
    departments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Department'
      }
    ],
    ratings: {
      type: Number,
      default: 0
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review'
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = model("University", universitySchema);
