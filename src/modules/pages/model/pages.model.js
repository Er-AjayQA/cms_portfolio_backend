const mongoose = require("mongoose");
const pageSectionModel = require("../../pageSection/model/pageSection.model");

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

const pageSchema = new mongoose.Schema(
  {
    pageKey: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
    },

    sections: [pageSectionSchema],

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
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
