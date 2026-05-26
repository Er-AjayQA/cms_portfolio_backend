const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AuthModel = require("../model/projects.model");

exports.createProject = async (req, res) => {
  try {
    const {
      title,
      slug,
      shortDescription,
      description,
      thumbnail,
      images,
      category,
      techStack,
      githubUrl,
      liveUrl,
      videoUrl,
      featured,
      status,
      startDate,
      endDate,
      clientName,
      role,
      challenges,
      solution,
      order,
    } = req.body;

    return res.status(200).json({
      message: "Login successfully",
      token,
      user: {
        email: existingUser.email,
        name: existingUser.name,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
