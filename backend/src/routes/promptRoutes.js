import express from "express";
import { convertPrompt } from "../controllers/promptController.js";

const router = express.Router();

router.post("/convert", convertPrompt);

export default router;
