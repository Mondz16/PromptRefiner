import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { getBalance, purchaseTokens } from "../controllers/tokenController.js";

const router = express.Router();

router.get("/balance", requireAuth, getBalance);
router.post("/purchase", requireAuth, purchaseTokens);

export default router;
