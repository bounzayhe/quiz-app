import jwt from "jsonwebtoken";
import { APIError } from "./errorMiddleware.js";
import Company from "../models/Company.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new APIError("No token provided", 401);
    }

    const token = authHeader.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If the user is a company, verify the token in the database
    if (decoded.role === "company") {
      const company = await Company.findOne({
        _id: decoded.id,
        token: token,
        tokenExpiry: { $gt: new Date() },
      });

      if (!company) {
        throw new APIError("Invalid or expired token", 403);
      }
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      next(new APIError("Invalid token", 403));
    } else if (error.name === "TokenExpiredError") {
      next(new APIError("Token expired", 403));
    } else {
      next(error);
    }
  }
};

export default authenticateToken;
authenticateToken;
