const techStackModel = require("../model/techStack.model");

exports.createTechStack = async (req, res) => {
  try {
    let { name, slug } = req.body;

    const isExist = await techStackModel.findOne({ name });

    if (isExist) {
      return res.status(400).json({ message: "Tech stack already exists" });
    }

    if (slug?.trim() === "") {
      slug = name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
    }

    const techStack = new techStackModel({ name, slug });
    await techStack.save();

    return res.status(200).json({
      message: "Tech stack created successfully",
      data: techStack,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateTechStack = async (req, res) => {
  try {
    const { slug } = req.params;
    const { name, newSlug, status } = req.body;

    const existingData = await techStackModel.findOne({
      slug,
      isDeleted: { $ne: true },
    });

    if (!existingData) {
      return res.status(400).json({ message: "No record found" });
    }

    const normalizedSlug = (newSlug || slug || "").trim().toLowerCase();

    if (normalizedSlug && normalizedSlug !== existingData.slug) {
      const slugExists = await techStackModel.findOne({
        slug: normalizedSlug,
        _id: { $ne: existingData._id },
        isDeleted: { $ne: true },
      });

      if (slugExists) {
        return res.status(400).json({
          success: false,
          message: "Slug already exists",
        });
      }
    }

    const techStack = await techStackModel.updateOne(
      { _id: existingData?._id },
      {
        name,
        slug: normalizedSlug,
        status,
      },
    );

    return res.status(201).json({
      success: true,
      message: "Record updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateStatusTechStack = async (req, res) => {
  try {
    const { slug } = req.params;

    const existingData = await techStackModel.findOne({
      slug,
      isDeleted: { $ne: true },
    });

    if (!existingData) {
      return res
        .status(400)
        .json({ success: false, message: "No record found" });
    }

    const data = await techStackModel.updateOne(
      { _id: existingData?._id },
      {
        status: existingData?.status === "active" ? "inactive" : "active",
      },
    );

    return res.status(201).json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllTechStack = async (req, res) => {
  try {
    const techStacks = await techStackModel.find().sort({ updatedAt: -1 });

    return res.status(200).json({
      message: "Tech stacks retrieved successfully",
      data: techStacks,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getBySlugTechStack = async (req, res) => {
  try {
    const { slug } = req.params;

    const data = await techStackModel.findOne({
      slug,
      isDeleted: { $ne: true },
    });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Record retrieved successfully",
        data: data,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Record retrieved successfully",
      data: data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.deleteTechStack = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await techStackModel.findById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    await techStackModel.updateOne({ _id: data._id }, { isDeleted: true });

    return res.status(201).json({
      success: true,
      message: "Record deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

exports.deleteMultipleTechStacks = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide record ids",
      });
    }

    const result = await techStackModel.updateMany(
      { _id: { $in: ids } },
      { $set: { isDeleted: true } },
    );

    return res.status(200).json({
      success: true,
      message: `${result.modifiedCount} record(s) deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
