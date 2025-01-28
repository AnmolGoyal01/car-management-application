import { Request, Response, NextFunction } from "express";
import { asyncHandler, ApiResponse, ApiError } from "../utils";
import User from "../models/user.model";

interface verifiedRequest extends Request {
    user?: any;
}

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { userName, fullName, email, password } = req.body;
    // Validate request
    if (
        [userName, fullName, email, password].some(
            (field) => !field || field.trim === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email format");
    }
    // Check if user already exists
    const existedUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }
    // Create new user
    const user = await User.create({
        userName,
        fullName,
        email,
        password,
    });
    // verify user creation
    const createdUser = await User.findById(user._id).select("-password");
    if (!createdUser) {
        throw new ApiError(
            500,
            "Something went wrong while registering the user"
        );
    }
    res.status(201).json(
        new ApiResponse(201, createdUser, "User Registered Sucessfully")
    );
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { userName, email, password } = req.body;
    //validate request
    if (!userName && !email) {
        throw new ApiError(400, "Username or Email is required");
    }
    if (!password) {
        throw new ApiError(400, "Password is required");
    }
    // Check if user exists
    const user = await User.findOne({
        $or: [{ userName }, { email }],
    });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    // Check if password is correct
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid credentials");
    }
    // Generate access token
    const accessToken = user.generateAccessToken();
    const loggedInUser = await User.findById(user._id).select("-password");

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none" as "none",
    };
    res.status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(200, loggedInUser, "User logged in successfully")
        );
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
    res.status(200)
        .clearCookie("accessToken")
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const getCurrentUser = asyncHandler(
    async (req: verifiedRequest, res: Response) => {
        res.status(200).json(
            new ApiResponse(200, req.user, "User info fetched successfully")
        );
    }
);

export { registerUser, loginUser, logoutUser, getCurrentUser };