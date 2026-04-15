import express from "express";
import { generateBlogImage } from "../controllers/imageController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isPro } from "../middleware/isProMiddleware.js";

const router = express.Router();

// POST /api/images/generate
router.post("/generate", protect, isPro, generateBlogImage);

export default router;
