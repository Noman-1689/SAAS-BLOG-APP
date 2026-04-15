import express from "express";
import {
  reviewResume,
  getResumeDetail,
} from "../controllers/resumeController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isPro } from "../middleware/isProMiddleware.js";

const router = express.Router();

// All resume routes require authentication
router.use(protect);

// POST /api/resumes/review
router.post("/review", isPro, reviewResume);

// GET /api/resumes/:id
router.get("/:id", getResumeDetail);

export default router;
