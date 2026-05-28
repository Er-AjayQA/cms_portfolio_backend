const projectController = require("../controller/projects.controller");
const { uploadProjectMedia } = require("../../../middleware/upload.middleware");

module.exports = (app) => {
  app.post(
    "/project/create",
    uploadProjectMedia,
    projectController.createProject,
  );
  app.put(
    "/projects/:slug",
    uploadProjectMedia,
    projectController.updateProject,
  );
  app.delete("/projects/:id", projectController.deleteProject);
  app.get("/projects", projectController.getAllProjects);
  app.get("/projects/:slug", projectController.getBySlugProject);
};
