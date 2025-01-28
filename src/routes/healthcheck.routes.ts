import { healthCheck } from "../controllers/healthcheck.controller";
import express from "express";

const router = express.Router();

router.get("/", healthCheck);

export default router;
