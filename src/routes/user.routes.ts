import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
} from "../controllers/user.controllers";
import { verifyJwt } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// secure routes
router.get("/me", verifyJwt, getCurrentUser);

export default router;
