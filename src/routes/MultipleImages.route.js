import { Router } from "express";
import { upload } from "../middlewares/Multer.middleware.js";
import { MultipleImage } from "../controllers/MultipleImage.controller.js";

const router = Router();
router.route("/uploadImages").post(upload.array("images", 4), MultipleImage);

export default router;
