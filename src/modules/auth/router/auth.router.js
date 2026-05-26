const authController = require("../controller/auth.controller");

module.exports = (app) => {
  app.post("/auth/login", authController.login);
};
