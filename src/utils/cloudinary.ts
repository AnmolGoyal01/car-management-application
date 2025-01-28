import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const uploadImagesOnCloudinary = async (images: any) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    try {
        if (!images || images.length === 0) {
            return [];
        }
        const imageUrls: string[] = [];
        for (let image of images) {
            const result = await cloudinary.uploader.upload(image.path, {
                resource_type: "image",
            });
            console.log(image.path);
            console.log(result);
            if (result?.secure_url) {
                imageUrls.push(result.secure_url);
            }
            fs.unlink(image.path, (err) => {
                if (err) {
                    console.error("Error deleting the local file:", err);
                }
            });
        }
        return imageUrls;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        for (let image of images) {
            fs.unlink(image.path, (err) => {
                if (err) {
                    console.error("Error deleting the local file:", err);
                }
            });
        }
        return [];
    }
};

export const deleteImagesFromCloudinary = async (images: string[]) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    if (!images || images.length === 0) {
        return;
    }
    for (let imageUrl of images) {
        const publicId = imageUrl.split("/").pop()?.split(".")[0];
        if (publicId) {
            try {
                await cloudinary.uploader.destroy(publicId);
            } catch (error: any) {
                console.error(
                    `Error deleting image from Cloudinary: ${error?.message}`
                );
            }
        }
    }
};
