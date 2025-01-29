import { healthCheck } from "../controllers/healthCheck.controller";
import express from "express";

const router = express.Router();

router.get("/", healthCheck);

export default router;
