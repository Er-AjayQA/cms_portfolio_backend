const projectController = require("../controller/projects.controller");

module.exports = (app) => {
  app.post("/project/create", projectController.createProject);
};
