// import express from "express";
// import {
//   login,
//   signup,
//   verifyOTP,
//   logout,
//   changePassword,
//   forgotPassword,
//   resetPassword,
//   googleAuthCallback,
//   getProfile,
// } from "../controllers/authController.js";
// import { protect } from "../middleware/authMiddleware.js";
// import { isPro } from "../middleware/isProMiddleware.js"; // New Middleware
// import passport from "../config/passport.js";
// import {
//   generateArticle,
//   getArticleById,
// } from "../controllers/articleController.js";
// import {
//   generateBlogTitles,
//   getTitleSetById,
// } from "../controllers/titleController.js";
// import { generateBlogImage } from "../controllers/imageController.js";
// import { getUserLibrary } from "../controllers/userController.js";
// import {
//   createCheckoutSession,
//   handleWebhook,
// } from "../controllers/stripeController.js";
// import {
//   getResumeDetail,
//   reviewResume,
// } from "../controllers/resumeController.js";

// const router = express.Router();

// // --- STRIPE ROUTES ---
// // NOTE: The webhook must be called with a raw body.
// // If this router is used in app.js AFTER express.json(),
// // you should move the webhook to app.js directly or use a specific middleware.
// router.post(
//   "/stripe/webhook",
//   express.raw({ type: "application/json" }),
//   handleWebhook,
// );
// router.post("/create-checkout", protect, createCheckoutSession);

// // --- PUBLIC AUTH ROUTES ---
// router.post("/signup", signup);
// router.post("/verify-otp", verifyOTP);
// router.post("/login", login);
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password", resetPassword);
// router.get("/profile", protect, getProfile);

// // --- PROTECTED ROUTES (Logged in) ---
// router.post("/logout", protect, logout);
// router.post("/change-password", protect, changePassword);
// router.get("/getUser-library", protect, getUserLibrary);

// // --- PREMIUM ROUTES (Logged in + PRO Plan) ---
// // Added 'isPro' middleware to gate these features
// router.post("/generate", protect, isPro, generateArticle);
// router.get("/generate/:id", protect, getArticleById);
// router.post("/generate-titles", protect, isPro, generateBlogTitles);
// router.get("/generate-titles/:id", protect, getTitleSetById);
// router.post("/generate-image", protect, isPro, generateBlogImage);
// router.post("/generate-resume", protect, isPro, reviewResume);
// router.get("/get-resume-review/:id", protect, isPro, getResumeDetail);

// // --- GOOGLE AUTH ---
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] }),
// );

// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     session: false,
//     failureRedirect: "/login",
//   }),
//   googleAuthCallback,
// );

// export default router;
