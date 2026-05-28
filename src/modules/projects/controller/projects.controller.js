const ProjectModel = require("../model/projects.model");
const ProjectMediaModel = require("../../projectsMedia/model/projectsMedia.model");

const projectPopulateConfig = [
  {
    path: "media",
  },
  {
    path: "techStackId",
    select: "_id name status isDeleted createdAt updatedAt",
  },
];

const formatProjectResponse = (project) => {
  if (!project) return project;

  const formattedProject =
    typeof project.toObject === "function" ? project.toObject() : project;

  return {
    ...formattedProject,
    techStack: formattedProject.techStackId || [],
  };
};

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

const normalizeObjectIdList = (value) =>
  parseArrayField(value)
    .map((item) => String(item).trim())
    .filter(Boolean);

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
      projectPopulateConfig,
    );

    return res.status(201).json({
      message: "Project created successfully",
      data: formatProjectResponse(populatedProject),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { slug } = req.params;
    const {
      title,
      slug: newSlug,
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
    } = req.body;

    const existingProject = await ProjectModel.findOne({
      slug,
      isDeleted: { $ne: true },
    });

    if (!existingProject) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const normalizedSlug = (newSlug || slug || "").trim().toLowerCase();

    if (normalizedSlug && normalizedSlug !== existingProject.slug) {
      const slugExists = await ProjectModel.findOne({
        slug: normalizedSlug,
        _id: { $ne: existingProject._id },
        isDeleted: { $ne: true },
      });

      if (slugExists) {
        return res.status(400).json({
          success: false,
          message: "Project slug already exists",
        });
      }
    }

    const thumbnailFile = req.files?.thumbnail?.[0];
    const mediaFiles = req.files?.media || [];
    const existingMediaIds = normalizeObjectIdList(req.body.existingMediaIds);

    const thumbnailUrl = thumbnailFile
      ? getUploadUrl(thumbnailFile.path)
      : thumbnail || existingProject.thumbnail;

    if (!thumbnailUrl) {
      return res.status(400).json({
        message: "Thumbnail is required.",
      });
    }

    existingProject.set({
      title,
      slug: normalizedSlug || existingProject.slug,
      shortDescription,
      description,
      thumbnail: thumbnailUrl,
      category,
      techStackId: parseArrayField(techStackId || techStack),
      githubUrl,
      liveUrl,
      featured: parseBooleanField(featured),
      status,
      startDate: startDate,
      endDate: endDate,
      clientName,
      role,
      challenges,
      solution,
    });

    const currentMediaDocs = await ProjectMediaModel.find({
      projectId: existingProject._id,
    });

    const mediaIdsToKeep = new Set(existingMediaIds);
    const removedMediaIds = currentMediaDocs
      .filter((item) => !mediaIdsToKeep.has(String(item._id)))
      .map((item) => item._id);

    if (removedMediaIds.length > 0) {
      await ProjectMediaModel.deleteMany({
        _id: { $in: removedMediaIds },
        projectId: existingProject._id,
      });
    }

    let preservedMediaDocs = currentMediaDocs.filter((item) =>
      mediaIdsToKeep.has(String(item._id)),
    );

    let createdMedia = [];

    if (mediaFiles.length > 0) {
      createdMedia = await ProjectMediaModel.insertMany(
        mediaFiles.map((file, index) => ({
          projectId: existingProject._id,
          url: getUploadUrl(file.path),
          type: file.mimetype.startsWith("video/") ? "video" : "image",
          position: preservedMediaDocs.length + index,
        })),
      );
    }

    preservedMediaDocs = preservedMediaDocs.map((item, index) => {
      item.position = index;
      return item;
    });

    if (preservedMediaDocs.length > 0) {
      await Promise.all(
        preservedMediaDocs.map((item) =>
          item.save({ validateBeforeSave: false }),
        ),
      );
    }

    existingProject.media = [
      ...preservedMediaDocs.map((item) => item._id),
      ...createdMedia.map((item) => item._id),
    ];

    await existingProject.save();

    const populatedProject = await ProjectModel.findById(
      existingProject._id,
    ).populate(projectPopulateConfig);

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: formatProjectResponse(populatedProject),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectModel.find({
      isDeleted: { $ne: true },
    }).populate(projectPopulateConfig);

    return res.status(200).json({
      success: true,
      message: "Projects retrieved successfully",
      data: projects.map(formatProjectResponse),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

exports.getBySlugProject = async (req, res) => {
  try {
    const { slug } = req.params;
    const project = await ProjectModel.findOne({ slug }).populate(
      projectPopulateConfig,
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project retrieved successfully",
      data: formatProjectResponse(project),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await ProjectModel.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await ProjectModel.updateOne({ _id: project._id }, { isDeleted: true });

    return res.status(201).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
