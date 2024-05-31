const { Schema, model } = require("mongoose");

const adminSchema = new Schema(
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
    role: {
      type: String,
      enum: ['superadmin', 'admin'],
      default: 'admin'
    },
    profilePicture: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = model("Admin", adminSchema);
