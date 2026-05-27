const ProjectModel = require("../model/projects.model");
const ProjectMediaModel = require("../../projectsMedia/model/projectsMedia.model");

const parseArrayField = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value !== "string") {
    return [];
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(trimmedValue);
    return Array.isArray(parsedValue) ? parsedValue.filter(Boolean) : [];
  } catch (_error) {
    return trimmedValue
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
};

const parseBooleanField = (value, fallback = false) => {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return fallback;

  return value.toLowerCase() === "true";
};

const parseNumberField = (value, fallback = 0) => {
  const parsedValue = Number(value);
  return Number.isNaN(parsedValue) ? fallback : parsedValue;
};

const getUploadUrl = (filePath) => {
  const normalizedPath = filePath.replace(/\\/g, "/");
  const relativePath = normalizedPath.split("uploads/")[1];
  return relativePath ? `/uploads/${relativePath}` : "";
};

exports.createProject = async (req, res) => {
  try {
    const {
      title,
      slug,
      shortDescription,
      description,
      thumbnail,
      category,
      techStack,
      techStackId,
      githubUrl,
      liveUrl,
      featured,
      status,
      startDate,
      endDate,
      clientName,
      role,
      challenges,
      solution,
      order,
    } = req.body;

    const existingProject = await ProjectModel.findOne({ slug });

    if (existingProject) {
      return res.status(400).json({ message: "Project slug already exists" });
    }

    const thumbnailFile = req.files?.thumbnail?.[0];
    const mediaFiles = req.files?.media || [];

    const thumbnailUrl = thumbnailFile
      ? getUploadUrl(thumbnailFile.path)
      : thumbnail;

    if (!thumbnailUrl) {
      return res.status(400).json({
        message: "Thumbnail is required.",
      });
    }

    const project = await ProjectModel.create({
      title,
      slug,
      shortDescription,
      description,
      thumbnail: thumbnailUrl,
      media: [],
      category,
      techStackId: parseArrayField(techStackId || techStack),
      githubUrl,
      liveUrl,
      featured: parseBooleanField(featured),
      status,
      startDate: startDate || null,
      endDate: endDate || null,
      clientName,
      role,
      challenges,
      solution,
      order: parseNumberField(order),
    });

    let createdMedia = [];

    if (mediaFiles.length > 0) {
      createdMedia = await ProjectMediaModel.insertMany(
        mediaFiles.map((file, index) => ({
          projectId: project._id,
          url: getUploadUrl(file.path),
          type: file.mimetype.startsWith("video/") ? "video" : "image",
          position: index,
        })),
      );

      project.media = createdMedia.map((item) => item._id);
      await project.save();
    }

    const populatedProject = await ProjectModel.findById(project._id).populate(
      "media",
    );

    return res.status(201).json({
      message: "Project created successfully",
      data: populatedProject,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectModel.find().populate("media");

    return res.status(200).json({
      message: "Projects retrieved successfully",
      data: projects,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

exports.getBySlugProject = async (req, res) => {
  try {
    const { slug } = req.params;
    const project = await ProjectModel.findOne({ slug }).populate([
      "media",
      "techStackId",
    ]);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    return res.status(200).json({
      message: "Project retrieved successfully",
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};
