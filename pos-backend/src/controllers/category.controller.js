import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Category } from "../models/category.models.js";

const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name?.trim() || !description?.trim()) {
    throw new ApiError(400, "All fields are required.");
  }

  const existedCategory = await Category.findOne({
    name,
  });
  if (existedCategory) {
    throw new ApiError(409, "Category already exists");
  }

  const imageOneLocalPath = req.files?.image1?.[0]?.path;
  // console.log("Image Local Path:", imageLocalPath);
  if (!imageOneLocalPath) {
    throw new ApiError(400, "Image file is required");
  }

  const image1 = await uploadOnCloudinary(imageOneLocalPath);
  if (!image1 || !image1.url) {
    throw new ApiError(402, "Image file is required");
  }

  const imageTwoLocalPath = req.files?.image2?.[0]?.path;
  // console.log("Image Local Path:", imageLocalPath);
  if (!imageTwoLocalPath) {
    throw new ApiError(400, "Image file is required");
  }

  const image2 = await uploadOnCloudinary(imageTwoLocalPath);
  if (!image2 || !image2.url) {
    throw new ApiError(402, "Image file is required");
  }

  const category = await Category.create({
    name,
    description,
    image1: image1.url,
    image2: image2.url,
  });

  if (!category) {
    throw new ApiError(500, "Something went wrong while creating the category");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, category, "New Category created successfully."));
});

const getAllCategory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 3, query, sortBy = "createdAt", sortType = -1, userId } = req.query;

  // Step 1: Build the aggregation pipeline
  const aggregationPipeline = [];

  // Step 2: Apply search filter if query is provided
  if (query) {
    aggregationPipeline.push({
      $match: {
        $or: [
          { name: { $regex: query, $options: "i" } }, // Case-insensitive title search
          { description: { $regex: query, $options: "i" } } // Case-insensitive description search
        ]
      }
    });
  }

  // Step 3: Sorting (Default: Newest first)
  aggregationPipeline.push({
    $sort: { [sortBy]: parseInt(sortType) } // Converts sortType ("1" or "-1") to Number
  });

  // Step 4: Apply Pagination
  const options = {
    page: parseInt(page),
    limit: parseInt(limit)
  };

  // Step 5: Execute the query
  const result = await Category.aggregatePaginate(Category.aggregate(aggregationPipeline), options);

  // Step 6: Send response
  return res.status(200).json(new ApiResponse(200, result, "Categories fetched successfully"));
});

export { createCategory , getAllCategory };
