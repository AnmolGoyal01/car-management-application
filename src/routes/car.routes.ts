import {
    addCar,
    getAllCars,
    getUserCars,
    getCarById,
    deleteCar,
    updateCar,
} from "../controllers/car.controllers";
import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware";
import { uploadImage } from "../middlewares/multer.middleware";

const router = Router();

router.get("/", getAllCars);

// secure routes
router.post("/add", verifyJwt, uploadImage.array("images", 10), addCar);
router.get("/my-cars", verifyJwt, getUserCars);
router.get("/:id", getCarById);
router.delete("/:id", verifyJwt, deleteCar);
router.patch("/:id", verifyJwt, uploadImage.array("images", 10), updateCar);

export default router;
