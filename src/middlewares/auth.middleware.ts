import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { asyncHandler, ApiError } from "../utils";

interface verifiedRequest extends Request {
    user?: any;
}

export const verifyJwt = asyncHandler(
    async (req: verifiedRequest, res: Response, next: NextFunction) => {
        const token: string =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        try {
            const decodedCode: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
            const user = await User.findById(decodedCode?._id).select(
                "-password"
            );
            if (!user) {
                throw new ApiError(401, "Invalid Access Token");
            }
            req.user = user;
            next();
        } catch (error) {
            throw new ApiError(401, "Invalid access token");
        }
    }
);
