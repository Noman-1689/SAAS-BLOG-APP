import express from "express";
import {
  createCheckoutSession,
  handleWebhook,
} from "../controllers/stripeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Webhook MUST use express.raw and comes BEFORE express.json() in app.js
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook,
);

router.post("/create-checkout", protect, createCheckoutSession);

export default router;
