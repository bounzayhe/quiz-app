import express from "express";
import {
  generateSurvey,
  getAllSurveys,
  updateSurvey,
  getQuestionnaireSection,
  getQuestionnaireSections,
} from "../controllers/surveyController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to generate a new questionnaire (admin only)
router.post("/generate", authenticateToken, generateSurvey);

// Route to get surveys (admin only)
router.get("/", authenticateToken, getAllSurveys);

// Route to update a survey (admin only)
router.put("/:surveyId", authenticateToken, updateSurvey);

// Route to get all sections of a questionnaire
router.get("/:questionnaireId/sections", getQuestionnaireSections);

// Route to get a specific section with its questions and responses
router.get("/:questionnaireId/sections/:sectionId", getQuestionnaireSection);

export default router;
