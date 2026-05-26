const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AuthModel = require("../model/auth.model");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await AuthModel.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid email or password" });
    } else {
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: existingUser._id,
          email: existingUser.email,
          name: existingUser.name,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
      );

      return res.status(200).json({
        message: "Login successfully",
        token,
        user: {
          email: existingUser.email,
          name: existingUser.name,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
