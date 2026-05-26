const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    thumbnail: {
      type: String,
      required: true,
    },

    images: [
      {
        type: String,
      },
    ],

    category: {
      type: String,
      enum: ["Frontend", "Backend", "Full Stack", "Mobile App", "UI/UX"],
      default: "Full Stack",
    },

    techStack: [
      {
        type: String,
        required: true,
      },
    ],

    githubUrl: String,
    liveUrl: String,
    videoUrl: String,

    featured: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    startDate: Date,
    endDate: Date,

    clientName: String,
    role: String,

    challenges: String,
    solution: String,

    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const projectModel = mongoose.model("project", projectSchema);
module.exports = projectModel;
