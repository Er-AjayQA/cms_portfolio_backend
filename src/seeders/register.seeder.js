require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db.config");
const AuthModel = require("../modules/auth/model/auth.model");

const passwordHash = async (password) => {
  try {
    if (!password) return null;
    else {
      const hashedPassword = await bcrypt.hash(password, 10);
      return hashedPassword;
    }
  } catch (error) {
    console.error("Error hashing password:", error);
    return null;
  }
};

const seedUsers = async () => {
  try {
    await connectDB();

    const password = await passwordHash("superadmin123");
    const user = {
      name: "Super Admin",
      email: "superadmin@gmail.com",
      password,
    };

    const existingAdmin = await AuthModel.findOne({ email: user.email });

    if (existingAdmin) {
      console.log("Admin already exists");
      await mongoose.connection.close();
      process.exit(0);
    }

    await AuthModel.create(user);
    console.log("Admin Seeded Successfully");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.log(error);
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  }
};

seedUsers();
