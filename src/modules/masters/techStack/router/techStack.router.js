const techStackController = require("../controller/techStack.controller");

module.exports = (app) => {
  app.post("/tech-stack/create", techStackController.createTechStack);
  app.get("/tech-stack/get-all", techStackController.getAllTechStack);
};
