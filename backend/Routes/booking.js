import express from "express";
import { authenticate } from "./../auth/verifyToken.js";
import {
  getCheckoutSession,
  verifyCheckoutSession,
} from "../Controllers/bookingController.js";

const router = express.Router();

router.post("/checkout-session/:doctorId", authenticate, getCheckoutSession);
router.get("/checkout-session/:sessionId", authenticate, verifyCheckoutSession);

export default router;
