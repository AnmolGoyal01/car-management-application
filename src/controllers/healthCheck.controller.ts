import { asyncHandler, ApiResponse } from "../utils";
import { Request, Response, NextFunction } from "express";

const healthCheck = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json(new ApiResponse(200, "OK", "Health check is OK"));
});

export { healthCheck };
