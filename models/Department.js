const { Schema, model } = require("mongoose");

const departmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    university: {
      type: Schema.Types.ObjectId,
      ref: 'University',
      required: true
    },
    faculty: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Faculty'
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = model("Department", departmentSchema);
