// backend/routes/plan.js
import { Router } from "express";
import { getPlans } from "../controllers/planController.js";

const router = Router();

// GET /api/plans
router.get("/", getPlans);

export default router;
