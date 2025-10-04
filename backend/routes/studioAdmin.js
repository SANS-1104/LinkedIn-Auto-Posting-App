import express from "express";
import { getAllUsers, updateUser, deleteUser } from "../controllers/adminStudioUserController.js";
import { getPlans, createPlan, updatePlan, deletePlan } from "../controllers/adminStudioPlanController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { isAdmin, isSuperAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// USER MANAGEMENT
// router.get("/users", authMiddleware, isAdmin, getAllUsers);
// router.put("/users/:id", authMiddleware, isAdmin, updateUser);
// router.delete("/users/:id", authMiddleware, isSuperAdmin, deleteUser);
router.get("/users", authMiddleware, getAllUsers);
router.put("/users/:id", authMiddleware, updateUser);
router.delete("/users/:id", authMiddleware, deleteUser);

// PLAN MANAGEMENT
// router.get("/plans", authMiddleware, isAdmin, getPlans);
// router.post("/plans", authMiddleware, isSuperAdmin, createPlan);
// router.put("/plans/:id", authMiddleware, isSuperAdmin, updatePlan);
// router.delete("/plans/:id", authMiddleware, isSuperAdmin, deletePlan);
router.get("/plans", authMiddleware, getPlans);
router.post("/plans", authMiddleware, createPlan);
router.put("/plans/:id", authMiddleware, updatePlan);
router.delete("/plans/:id", authMiddleware, deletePlan);


export default router;
