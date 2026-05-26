const authController = require("../controller/auth.controller");

module.exports = (app) => {
  app.post("/login", authController.login);
};
