// // File: backend/routes/auth.js

import { Router } from "express";
const router = Router();
import authMiddleware from "../middleware/authMiddleware.js";
import { signup, login, getProfile, updatePreference, refreshToken, updateProfile } from "../controllers/authController.js";
import { linkedinOAuthStart, linkedinOAuthCallback, disconnectLinkedIn, getLinkedInUserData } from "../controllers/linkedinController.js";

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put("/preferences", authMiddleware, updatePreference);
router.get("/linkedin/start", linkedinOAuthStart);
router.get("/auth/linkedin/callback", linkedinOAuthCallback);
router.post("/disconnect", authMiddleware, disconnectLinkedIn);
router.get("/user-data", authMiddleware, getLinkedInUserData);
// router.post("/logout", authMiddleware, logout);

export default router;
