import Company from "../models/Company.js";
import jwt from "jsonwebtoken";
import { APIError } from "../middlewares/errorMiddleware.js";
import { asyncHandler } from "../middlewares/errorMiddleware.js";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new APIError("Email and password are required", 400);
  }

  const company = await Company.findOne({ email }).select("+password");
  if (!company) {
    throw new APIError("Invalid credentials", 401);
  }

  if (password !== company.password) {
    throw new APIError("Invalid credentials", 401);
  }

  const token = jwt.sign(
    { id: company._id, role: company.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // If user is a company, store the token in the database
  if (company.role === "company") {
    const tokenExpiry = new Date();
    tokenExpiry.setDate(tokenExpiry.getDate() + 1); // Set expiry to 1 day from now

    company.token = token;
    company.tokenExpiry = tokenExpiry;
    await company.save();
  }

  res.status(200).json({
    status: "success",
    role: company.role,
    token,
  });
});
