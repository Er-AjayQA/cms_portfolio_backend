const projectController = require("../controller/projects.controller");

module.exports = (app) => {
  app.post("/createproject", projectController.createProject);
};
