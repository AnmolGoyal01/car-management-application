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

app.get("/api/docs", (req: Request, res: Response) => {
    res.redirect("https://documenter.getpostman.com/view/39284494/2sAYX2N4Zu");
});

// Routes import
import healthCheckRouter from "./routes/healthcheck.routes";
import userRouter from "./routes/user.routes";
import carRouter from "./routes/car.routes";

// Routes declare
app.use("/api/healthcheck", healthCheckRouter);
app.use("/api/user", userRouter);
app.use("/api/car", carRouter);

export default app;
