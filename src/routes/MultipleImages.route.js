import { Router } from "express";
import { upload } from "../middlewares/Multer.middleware.js";
import {
  DelSingleImage,
  getMultipleImage,
  MultipleImage,
  updateSingleImage,
} from "../controllers/MultipleImage.controller.js";

const router = Router();
router.route("/uploadImages").post(upload.array("images", 4), MultipleImage);
router.route("/getImages").get(getMultipleImage);
router.route("/updateImage").put(updateSingleImage);
router.route("/delImage").delete(DelSingleImage);

export default router;
