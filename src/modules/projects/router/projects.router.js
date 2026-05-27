const projectController = require("../controller/projects.controller");
const { uploadProjectMedia } = require("../../../middleware/upload.middleware");

module.exports = (app) => {
  app.post(
    "/project/create",
    uploadProjectMedia,
    projectController.createProject,
  );
  app.get("/projects", projectController.getAllProjects);
};
