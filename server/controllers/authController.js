import Company from "../models/Company.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (password !== company.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: company._id, role: company.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    company.token = token;
    await company.save();

    res.status(200).json({
      message: "Login successful",
      role: company.role,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
