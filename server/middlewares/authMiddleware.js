import jwt from "jsonwebtoken";
import { APIError } from "./errorMiddleware.js";

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new APIError("No token provided", 401);
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        throw new APIError("Invalid or expired token", 403);
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    next(error);
  }
};

export default authenticateToken;
