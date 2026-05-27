const mongoose = require("mongoose");

const techStackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const techStackModel = mongoose.model("techStack", techStackSchema);
module.exports = techStackModel;
