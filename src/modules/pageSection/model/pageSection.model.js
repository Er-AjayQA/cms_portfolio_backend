const mongoose = require("mongoose");

const pageSectionSchema = new mongoose.Schema(
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
      trim: true,
    },

    display_order: {
      type: Number,
      default: 1,
    },

    contentJson: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
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

const pageSectionModel = mongoose.model("pageSection", pageSectionSchema);
module.exports = pageSectionModel;
