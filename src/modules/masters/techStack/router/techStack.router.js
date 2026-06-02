const techStackController = require("../controller/techStack.controller");

module.exports = (app) => {
  app.post("/tech-stack/create", techStackController.createTechStack);
  app.put("/tech-stack/update/:slug", techStackController.updateTechStack);
  app.put(
    "/tech-stack/update-status/:slug",
    techStackController.updateStatusTechStack,
  );
  app.delete(
    "/tech-stack/delete-multiple",
    techStackController.deleteMultipleTechStacks,
  );
  app.get("/tech-stack/get-all", techStackController.getAllTechStack);
  app.get(
    "/tech-stack/get-by-slug/:slug",
    techStackController.getBySlugTechStack,
  );
  app.delete("/tech-stack/delete/:id", techStackController.deleteTechStack);
};
