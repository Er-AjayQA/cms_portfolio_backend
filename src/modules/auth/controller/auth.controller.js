const AuthModel = require("../model/auth.model");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await AuthModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new AuthModel({ email, password: hashedPassword });
      await newUser.save();
      return res.status(201).json({ message: "User registered successfully" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
