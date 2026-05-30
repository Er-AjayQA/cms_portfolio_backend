const PageModel = require("../model/pages.model");

const normalizeSections = (sections = [], pageId) => {
  if (!Array.isArray(sections)) {
    return [];
  }

  return sections.map((section, index) => ({
    pageId,
    sectionType: section?.sectionType || "hero",
    title: section?.title || section?.sectionType || `section-${index + 1}`,
    subTitle: section?.subTitle || "",
    display_order: Number(section?.display_order || index + 1),
    contentJson:
      section?.contentJson && typeof section.contentJson === "object"
        ? section.contentJson
        : {},
    isVisible: Boolean(section?.isVisible),
    isDeleted: Boolean(section?.isDeleted),
  }));
};

exports.createPage = async (req, res) => {
  try {
    const { title, pageKey, slug, status, sections } = req.body;

    const existingPage = await PageModel.findOne({ slug });

    if (existingPage) {
      return res.status(400).json({ message: "Page slug already exists" });
    }

    const page = new PageModel({
      title,
      pageKey,
      slug,
      status,
      sections: [],
    });

    page.sections = normalizeSections(sections, page._id);
    await page.save();

    return res.status(201).json({
      message: "Page created successfully",
      data: page,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

exports.updatePage = async (req, res) => {
  try {
    const { slug } = req.params;
    const { title, pageKey, slug: newSlug, status, sections } = req.body;

    const existingPage = await PageModel.findOne({
      slug,
      isDeleted: { $ne: true },
    });

    if (!existingPage) {
      return res
        .status(404)
        .json({ success: false, message: "Page not found" });
    }

    const normalizedSlug = (newSlug || slug || "").trim().toLowerCase();

    if (normalizedSlug && normalizedSlug !== existingPage.slug) {
      const slugExists = await PageModel.findOne({
        slug: normalizedSlug,
        _id: { $ne: existingPage._id },
        isDeleted: { $ne: true },
      });

      if (slugExists) {
        return res.status(400).json({
          success: false,
          message: "Page slug already exists",
        });
      }
    }

    existingPage.set({
      title,
      pageKey,
      slug: normalizedSlug || existingPage.slug,
      status,
      sections: normalizeSections(sections, existingPage._id),
    });

    await existingPage.save();

    const page = await PageModel.findById(existingPage._id);

    return res.status(200).json({
      success: true,
      message: "Page updated successfully",
      data: page,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

exports.getAllPages = async (req, res) => {
  try {
    const pages = await PageModel.find({
      isDeleted: { $ne: true },
    });

    return res.status(200).json({
      success: true,
      message: "Pages retrieved successfully",
      data: pages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

exports.getBySlugPage = async (req, res) => {
  try {
    const { slug } = req.params;
    const page = await PageModel.findOne({ slug });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Page retrieved successfully",
      data: page,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

exports.deletePage = async (req, res) => {
  try {
    const { id } = req.params;
    const Page = await PageModel.findById(id);

    if (!Page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    await PageModel.updateOne({ _id: Page._id }, { isDeleted: true });

    return res.status(201).json({
      success: true,
      message: "Page deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

exports.deleteMultiplePages = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide page ids",
      });
    }

    const result = await PageModel.updateMany(
      { _id: { $in: ids } },
      { $set: { isDeleted: true } },
    );

    return res.status(200).json({
      success: true,
      message: `${result.modifiedCount} page(s) deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
