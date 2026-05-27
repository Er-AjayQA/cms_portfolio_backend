const mongoose = require("mongoose");

const projectMediaSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["image", "video"],
    },
    position: {
      type: Number,
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const projectMediaModel = mongoose.model("projectMedia", projectMediaSchema);
module.exports = projectMediaModel;
