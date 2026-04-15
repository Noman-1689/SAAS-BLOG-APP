import express from "express";
import passport from "../config/passport.js";
import {
  signup,
  verifyOTP,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  getProfile,
  googleAuthCallback,
} from "../controllers/authController.js";
import { getUserLibrary } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// --- 1. Standard Auth Routes ---
router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// --- 2. Google Auth Routes ---
// These are public because they initiate the login process
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleAuthCallback,
);

// --- 3. Protected User Routes ---
router.use(protect); // Middleware applies to everything below
router.get("/profile", getProfile);
router.post("/logout", logout);
router.post("/change-password", changePassword);
router.get("/library", getUserLibrary);

export default router;
