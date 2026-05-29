const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
  {
    pageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "page",
      required: true,
    },

    sectionType: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    subTitle: {
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

    isVisible: {
      type: Boolean,
      default: false,
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
