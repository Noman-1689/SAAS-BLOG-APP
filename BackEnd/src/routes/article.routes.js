import express from "express";
import {
  generateArticle,
  getArticleById,
} from "../controllers/articleController.js";
import {
  generateBlogTitles,
  getTitleSetById,
} from "../controllers/titleController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isPro } from "../middleware/isProMiddleware.js";

const router = express.Router();

// All article routes require being logged in
router.use(protect);

router.post("/", isPro, generateArticle);
router.get("/:id", getArticleById);
router.post("/titles", isPro, generateBlogTitles);
router.get("/titles/:id", getTitleSetById);

export default router;
