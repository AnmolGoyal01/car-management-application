import { Request, Response, NextFunction } from "express";
import { asyncHandler, ApiResponse, ApiError } from "../utils";
import Car from "../models/car.model";
import {
    uploadImagesOnCloudinary,
    deleteImagesFromCloudinary,
} from "../utils/cloudinary";
import mongoose from "mongoose";
import fs from "fs";

interface verifiedRequest extends Request {
    user?: any;
}

const unlinkImages = (images: Express.Multer.File[]) => {
    images.forEach((image) => {
        fs.unlink(image.path, (err) => {
            if (err) {
                console.error("Error deleting the local file:", err);
            }
        });
    });
};

const addCar = asyncHandler(async (req: verifiedRequest, res: Response) => {
    const user = req.user;
    const { title, description, tags } = req.body;
    // Validate request
    if (!title || title.trim() === "" || description.trim() === "") {
        unlinkImages(req.files as Express.Multer.File[]);
        throw new ApiError(400, "Title and description is required");
    }
    // Check if car with title already exists
    const alreadyCar = await Car.findOne({ title });
    if (alreadyCar) {
        unlinkImages(req.files as Express.Multer.File[]);
        throw new ApiError(409, "Car with title already exists");
    }
    // convert tags string to array
    const tagsArray = tags.split(",").map((tag: string) => tag.trim());

    // Check if images are provided
    const images = req.files as Express.Multer.File[];
    if (!images || images.length === 0) {
        unlinkImages(req.files as Express.Multer.File[]);
        throw new ApiError(400, "At least 1 image is required");
    }

    // Upload images to cloudinary
    const imageUrls = await uploadImagesOnCloudinary(images);

    // Verify that images were uploaded successfully
    if (imageUrls.length === 0) {
        throw new ApiError(500, "No images uploaded to Cloudinary");
    }

    // Create new car
    const car = await Car.create({
        title,
        description,
        tags: tagsArray,
        images: imageUrls,
        owner: user._id,
    });
    // Verify car creation
    if (!car) {
        throw new ApiError(500, "Something went wrong while adding the car");
    }
    res.status(201).json(new ApiResponse(201, car, "Car added successfully"));
});

const getAllCars = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const cars = await Car.find()
            .skip(skip)
            .limit(limit)
            .populate("owner", "userName fullName");

        const totalCars = await Car.countDocuments();
        const totalPages = Math.ceil(totalCars / limit);

        res.status(200).json(
            new ApiResponse(
                200,
                {
                    cars,
                    totalCars,
                    totalPages,
                    currentPage: page,
                },
                "Cars retrieved successfully"
            )
        );
    }
);

const getUserCars = asyncHandler(
    async (req: verifiedRequest, res: Response, next: NextFunction) => {
        const user = req.user;

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const cars = await Car.find({ owner: user._id })
            .skip(skip)
            .limit(limit)
            .populate("owner", "userName fullName");

        const totalCars = await Car.countDocuments();
        const totalPages = Math.ceil(totalCars / limit);

        res.status(200).json(
            new ApiResponse(
                200,
                {
                    cars,
                    totalCars,
                    totalPages,
                    currentPage: page,
                },
                "Cars retrieved successfully"
            )
        );
    }
);

const getCarById = asyncHandler(async (req: Request, res: Response) => {
    if (!mongoose.Types.ObjectId.isValid(req.params?.id)) {
        throw new ApiError(400, "Invalid car ID");
    }
    const car = await Car.findById(req.params?.id).populate(
        "owner",
        "userName fullName"
    );
    if (!car) {
        throw new ApiError(404, "Car not found");
    }
    res.status(200).json(
        new ApiResponse(200, car, "Car retrieved successfully")
    );
});

const updateCar = asyncHandler(async (req: verifiedRequest, res: Response) => {
    const user = req.user;
    const carId = req.params.id;
    const { title, description, tags, replaceImages = false } = req.body;

    // Validate request
    if (!title && !description && !tags && !req.files) {
        throw new ApiError(400, "No data to update");
    }
    // Find the car
    const car = await Car.findById(carId);
    if (!car) {
        throw new ApiError(404, "Car not found");
    }
    // Check if the car belongs to the current user
    if (car.owner.toString() !== user._id.toString()) {
        throw new ApiError(403, "Unauthorized");
    }
    // Handle title update (only if title doesn't already exist)
    if (title && title !== car.title) {
        const alreadyCar = await Car.findOne({ title });
        if (alreadyCar) {
            throw new ApiError(409, "Car with this title already exists");
        }
        car.title = title;
    }
    // Update description and tags
    if (description) car.description = description;
    if (tags) car.tags = tags.split(",").map((tag: string) => tag.trim());

    // Handle image update logic
    const localImages = req.files as Express.Multer.File[];
    if (localImages && localImages.length > 0) {
        if (replaceImages) {
            // If replaceImages is true, delete existing images
            deleteImagesFromCloudinary(car.images);
            car.images = [];
        }

        // Upload new images to Cloudinary
        const newImageUrls = await uploadImagesOnCloudinary(localImages);
        if (newImageUrls.length === 0) {
            throw new ApiError(500, "No images uploaded to Cloudinary");
        }

        // Add new images to the car document
        car.images.push(...newImageUrls);
    }
    await car.save();
    res.status(200).json(new ApiResponse(200, car, "Car updated successfully"));
});

const deleteCar = asyncHandler(async (req: verifiedRequest, res: Response) => {
    const user = req.user;
    // Check if car ID is provided
    if (req.params?.id == null || req.params?.id == "") {
        throw new ApiError(400, "Car ID is required");
    }
    // Check if car exists
    const car = await Car.findById(req.params.id);
    if (!car) {
        throw new ApiError(404, "Car not found");
    }
    // Check if user is the owner of the car
    if (car.owner?.toString() !== user._id?.toString()) {
        throw new ApiError(403, "Unauthorized");
    }

    deleteImagesFromCloudinary(car.images);

    // Delete the car
    await Car.deleteOne({ _id: req.params.id });
    // Send response
    res.status(200).json(new ApiResponse(200, {}, "Car deleted successfully"));
});

export { addCar, getAllCars, getUserCars, getCarById, deleteCar, updateCar };
