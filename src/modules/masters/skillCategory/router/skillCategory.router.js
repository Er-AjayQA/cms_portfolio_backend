const skillCategoryController = require("../controller/skillCategory.controller");

module.exports = (app) => {
  app.post(
    "/skill-category/create",
    skillCategoryController.createSkillCategory,
  );
  app.put(
    "/skill-category/update/:slug",
    skillCategoryController.updateSkillCategory,
  );
  app.put(
    "/skill-category/update-status/:slug",
    skillCategoryController.updateStatusSkillCategory,
  );
  app.delete(
    "/skill-category/delete-multiple",
    skillCategoryController.deleteMultipleSkillCategories,
  );
  app.get(
    "/skill-category/get-all",
    skillCategoryController.getAllSkillCategory,
  );
  app.get(
    "/skill-category/get-by-slug/:slug",
    skillCategoryController.getBySlugSkillCategory,
  );
  app.delete(
    "/skill-category/delete/:id",
    skillCategoryController.deleteSkillCategory,
  );
};
