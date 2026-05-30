const skillCategoryModel = require("../model/skillCategory.model");

exports.createSkillCategory = async (req, res) => {
  try {
    const { name, slug, status } = req.body;

    const isExist = await skillCategoryModel.findOne({
      $or: [{ name }, { slug }],
      isDeleted: { $ne: true },
    });

    if (isExist) {
      return res.status(400).json({
        message: "Skill category with same name or slug already exists",
      });
    }

    const skillCateogry = new skillCategoryModel({ name, slug, status });
    await skillCateogry.save();

    return res.status(200).json({
      message: "Skill category created successfully",
      data: skillCateogry,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateSkillCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const { name, slug: newSlug, status } = req.body;

    const existingData = await skillCategoryModel.findOne({
      slug,
      isDeleted: { $ne: true },
    });

    if (!existingData) {
      return res.status(400).json({ message: "No record found" });
    }

    const normalizedSlug = (newSlug || slug || "").trim().toLowerCase();

    if (normalizedSlug && normalizedSlug !== existingData.slug) {
      const slugExists = await skillCategoryModel.findOne({
        slug: normalizedSlug,
        _id: { $ne: existingData._id },
        isDeleted: { $ne: true },
      });

      if (slugExists) {
        return res.status(400).json({
          success: false,
          message: "Category slug already exists",
        });
      }
    }

    const skillCateogry = await skillCategoryModel.updateOne(
      { _id: existingData?._id },
      {
        name,
        slug: normalizedSlug || existingData.slug,
        status,
      },
    );

    return res.status(201).json({
      message: "Skill category updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateStatusSkillCategory = async (req, res) => {
  try {
    const { slug } = req.params;

    const existingData = await skillCategoryModel.findOne({
      slug,
      isDeleted: { $ne: true },
    });

    if (!existingData) {
      return res
        .status(400)
        .json({ success: false, message: "No record found" });
    }

    const skillCateogry = await skillCategoryModel.updateOne(
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

exports.getAllSkillCategory = async (req, res) => {
  try {
    const skillCategory = await skillCategoryModel.find({
      isDeleted: { $ne: true },
    });

    return res.status(200).json({
      message: "Skill category retrieved successfully",
      data: skillCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getBySlugSkillCategory = async (req, res) => {
  try {
    const { slug } = req.params;

    const data = await skillCategoryModel.findOne({
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

exports.deleteSkillCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await skillCategoryModel.findById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }

    await skillCategoryModel.updateOne({ _id: data._id }, { isDeleted: true });

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

exports.deleteMultipleSkillCategories = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide record ids",
      });
    }

    const result = await skillCategoryModel.updateMany(
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
