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

const getMultipleImage = asyncHandler(async (req, res) => {
  try {
    const getImages = await Images.findById({});
    if (!getImages || getImages.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "No images found."));
    }

    return res
      .status(201)
      .json(new ApiResponse(200, getImages, "Images Get successfully."));
  } catch (error) {
    throw new ApiError(500, "Internal server error while fetching images.");
  }
});

const updateSingleImage = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const update = req.body;

  try {
    if (!_id) {
      return res.status(404).json(new ApiResponse(404, null, "No _id found."));
    }
    const UpdateImage = await Images.findByIdAndUpdate({ id: _id }, update, {
      new: true,
    });
    return res
      .status(201)
      .json(new ApiResponse(200, UpdateImage, "Image Update successfully."));
  } catch (error) {
    throw new ApiError(500, "Internal server error while Updating image.");
  }
});

const DelSingleImage = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  try {
    if (!_id) {
      return res.status(404).json(new ApiResponse(404, null, "No _id found."));
    }
    const imageDel = await Images.findByIdAndDelete({ id: _id });
    return res
      .status(201)
      .json(new ApiResponse(200, imageDel, "Image delete successfully."));
  } catch (error) {
    throw new ApiError(500, "Internal server error while deleting image.");
  }
});

export { MultipleImage, getMultipleImage, updateSingleImage, DelSingleImage };
