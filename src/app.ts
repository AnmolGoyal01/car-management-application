import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Middlewares
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(cookieParser());

// Routes import
import healthCheckRouter from "./routes/healthcheck.routes";
import userRouter from "./routes/user.routes";

// Routes declare
app.use("/api/healthcheck", healthCheckRouter);
app.use("/api/user", userRouter);

export default app;
