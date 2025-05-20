import express from "express";
import {
  generateSurvey,
  getAllSurveys,
  updateSurvey,
} from "../controllers/surveyController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to generate a new questionnaire (admin only)
router.post("/generate", authenticateToken, generateSurvey);

// Route to get surveys (admin only)
router.get("/", authenticateToken, getAllSurveys);

// Route to update a survey (admin only)
router.put("/:surveyId", authenticateToken, updateSurvey);

export default router;
