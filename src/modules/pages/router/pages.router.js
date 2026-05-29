const pageController = require("../controller/pages.controller");

module.exports = (app) => {
  app.post("/page/create", pageController.createPage);
  app.put("/page/:slug", pageController.updatePage);
  app.get("/page", pageController.getAllPages);
  app.delete("/page/delete-pages", pageController.deleteMultiplePages);
  app.get("/page/:slug", pageController.getBySlugPage);
  app.delete("/page/:id", pageController.deletePage);
};
