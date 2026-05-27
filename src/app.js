const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

require("./modules/auth/router/auth.router")(app);
require("./modules/masters/techStack/router/techStack.router")(app);
require("./modules/projects/router/projects.router")(app);

app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
