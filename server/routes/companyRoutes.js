import express from "express";
import {
  getCompaniesWithStats,
  getQuestionnaireClientsWithResponses,
  registerClient,
} from "../controllers/companyController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/stats", authenticateToken, getCompaniesWithStats);
router.get(
  "/clients-responses",
  authenticateToken,
  getQuestionnaireClientsWithResponses
);
router.post("/register-client", registerClient);

// Remove the duplicate route definition below
// router.get("/stats", authMiddleware, (req, res) => getCompaniesStats(req, res));

export default router;
