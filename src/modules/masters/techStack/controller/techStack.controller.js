const techStackModel = require("../model/techStack.model");

exports.createTechStack = async (req, res) => {
  try {
    const { name } = req.body;

    const isExist = await techStackModel.findOne({ name });

    if (isExist) {
      return res.status(400).json({ message: "Tech stack already exists" });
    }

    const techStack = new techStackModel({ name });
    await techStack.save();

    return res.status(200).json({
      message: "Tech stack created successfully",
      data: techStack,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllTechStack = async (req, res) => {
  try {
    const techStacks = await techStackModel.find();

    return res.status(200).json({
      message: "Tech stacks retrieved successfully",
      data: techStacks,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
