import express from "express";
import {
  getCompaniesWithStats,
  getQuestionnaireClientsWithResponses,
  registerClient,
  getScoreTrendsOverTime,
  calculateClientScores,
} from "../controllers/companyController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/stats", authenticateToken, getCompaniesWithStats);
router.get("/score-trends", authenticateToken, getScoreTrendsOverTime);
router.get(
  "/client/:client_id/scores",
  authenticateToken,
  calculateClientScores
);
router.get(
  "/clients-responses",
  authenticateToken,
  getQuestionnaireClientsWithResponses
);
router.post(
  "/:companyId/questionnaires/:questionnaireId/inscription",
  registerClient
);

// Remove the duplicate route definition below
// router.get("/stats", authMiddleware, (req, res) => getCompaniesStats(req, res));

export default router;
