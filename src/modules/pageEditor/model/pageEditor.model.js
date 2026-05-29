const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
  {
    pageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "page",
      required: true,
    },

    sectionKey: {
      type: String,
      required: true,
      trim: true,
    },

    sectionType: {
      type: String,
      required: true,
      trim: true,
    },

    label: {
      type: String,
      required: true,
      trim: true,
    },

    display_order: {
      type: Number,
      default: 1,
    },

    settingsJson: {
      type: JSON,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const pageModel = mongoose.model("page", pageSchema);
module.exports = pageModel;
