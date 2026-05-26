const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./modules/auth/router/auth.router")(app);
require("./modules/projects/router/projects.router")(app);

app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
