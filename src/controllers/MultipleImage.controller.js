import { Images } from "../models/MultipleImage.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

const MultipleImage = asyncHandler(async (req, res) => {
  const files = req.files;

  if (!files || files.length === 0) {
    throw new ApiError(400, "No images uploaded.");
  }

  // Check if the files array is not empty
  const imagePaths = files.map((file) => file.path);

  // Upload images to Cloudinary
  const images = await uploadOnCloudinary(imagePaths);

  // Save image URLs to the database
  const MI = await Images.create({ images });

  return res
    .status(201)
    .json(new ApiResponse(200, MI, "Images uploaded successfully."));
});

export { MultipleImage };
