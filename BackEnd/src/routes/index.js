import express from "express";
import authRoutes from "./auth.routes.js";
import articleRoutes from "./article.routes.js";
import imageRoutes from "./image.routes.js";
import resumeRoutes from "./resume.routes.js";
import stripeRoutes from "./stripe.routes.js";

const router = express.Router();

// Prefixing each module
router.use("/auth", authRoutes);
router.use("/articles", articleRoutes);
router.use("/images", imageRoutes);
router.use("/resumes", resumeRoutes);
router.use("/stripe", stripeRoutes);

export default router;
