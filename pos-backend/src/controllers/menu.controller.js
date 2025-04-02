import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Menu } from "../models/menu.models.js";
import mongoose, { Model } from "mongoose";

const createItem = asyncHandler(async (req, res) => {
  const { itemName, itemDesc, itemPrice, itemCategory, stock, dealType } =
    req.body;

  if (
    [itemName, itemDesc, itemCategory, dealType].some(
      (field) => field?.trim() === ""
    ) ||
    [itemPrice, stock].some((field) => field === undefined || field === null)
  ) {
    throw new ApiError(400, "All fields are required.");
  }

  const existedItem = await Menu.findOne({
    itemName,
  });
  if (existedItem) {
    throw new ApiError(409, "Item already exists");
  }

  const imageLocalPath = req.file?.path;
  // console.log("Image Local Path:", imageLocalPath);
  if (!imageLocalPath) {
    throw new ApiError(400, "Image file is required");
  }

  const image = await uploadOnCloudinary(imageLocalPath);
  if (!image || !image.url) {
    throw new ApiError(402, "Image file is required");
  }

  const item = await Menu.create({
    itemName,
    itemDesc,
    itemPrice,
    itemCategory,
    stock,
    dealType,
    image: image.url,
  });

  if (!item) {
    throw new ApiError(
      500,
      "Something went wrong while creating the menu item"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, item, "New MenuItem created successfully."));
});

const getAllItems = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 3,
    query,
    sortBy = "createdAt",
    sortType = -1,
  } = req.query;

  // Step 1: Build the aggregation pipeline
  const aggregationPipeline = [];

  // Step 2: Apply search filter if query is provided
  if (query) {
    aggregationPipeline.push({
      $match: {
        $or: [
          { itemName: { $regex: query, $options: "i" } }, // Case-insensitive title search
          { itemDesc: { $regex: query, $options: "i" } }, // Case-insensitive description search
        ],
      },
    });
  }

  // Step 3: Sorting (Default: Newest first)
  aggregationPipeline.push({
    $sort: { [sortBy]: parseInt(sortType) }, // Converts sortType ("1" or "-1") to Number
  });

  // Step 4: Apply Pagination
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  // Step 5: Execute the query
  const result = await Menu.aggregatePaginate(
    Menu.aggregate(aggregationPipeline),
    options
  );

  // Step 6: Send response
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Categories fetched successfully"));
});

const updateItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new ApiError(400, "Invalid MenuItem ID format");
  }

  const itemExist = await Menu.findById(itemId);

  if (!itemExist) {
    throw new ApiError(401, "Enter valid MenuItem");
  }

  const {
    itemName,
    itemDesc,
    itemPrice,
    itemCategory,
    stock,
    dealType,
    itemAvailability,
  } = req.body;

  if (
    !itemName ||
    !itemDesc ||
    itemPrice === undefined ||
    !itemCategory ||
    !dealType ||
    stock === undefined ||
    itemAvailability === undefined
  ) {
    throw new ApiError(401, "All Fields are required")
  }

  const itemUpdated = await Menu.findByIdAndUpdate(
    itemId,
    {
      $set: {
        itemName,
        itemDesc,
        itemPrice,
        itemCategory,
        itemAvailability,
        stock,
        dealType,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, itemUpdated, "Item Updated successfully"));
});

const updateItemImage = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new ApiError(400, "Invalid MenuItem ID format");
  }

  const itemExist = await Menu.findById(itemId);

  if (!itemExist) {
    throw new ApiError(401, "Enter valid MenuItem");
  }

  const imageLocalPath = req.file?.path;

  if (!imageLocalPath) {
    throw new ApiError(400, "Image is required");
  }

  const item = await Menu.findById(itemId);
  if (!item) {
    throw new ApiError(404, "MenuItem not found");
  }

  if (item.image) {
    const imageUrl = item.image;

    if (imageUrl.startsWith("http")) {
      // Cloudinary Image - Extract public_id and delete it
      const oldImagePublicId = imageUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(oldImagePublicId);
    } else {
      // Local File - Delete from file system
      const localFilePath = path.join(
        __dirname,
        "../uploads",
        path.basename(imageUrl)
      );
      fs.unlink(localFilePath, (err) => {
        if (err) {
          console.error("Error deleting old local file:", err);
        }
      });
    }
  }

  const image = await uploadOnCloudinary(imageLocalPath);

  if (!image.url) {
    throw new ApiError(400, "Error while uploading image on Cloudinary");
  }

  fs.unlink(imageLocalPath, (err) => {
    if (err) {
      console.error("Error deleting new local file:", err);
    }
  });

  const itemUpdated = await Menu.findByIdAndUpdate(
    itemId,
    {
      $set: {
        image: image.url,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, itemUpdated, "Image Updated Successfully"));
});

const deleteItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new ApiError(404, "Item does not exist");
  }

  const itemExist = await Menu.findById(itemId);

  if (!itemExist) {
    throw new ApiError(400, "Enter valid menuItem id");
  }
  if (itemExist.image) {
    const imageUrl = itemExist.image;

    try {
      // Deleting Thumbnail
      if (imageUrl.startsWith("http")) {
        const oldImagePublicId =
          await cloudinary.utils.extractPublicId(imageUrl);
        await cloudinary.uploader.destroy(oldImagePublicId);
      } else {
        const localImagePath = path.join(
          __dirname,
          "../uploads",
          path.basename(imageUrl)
        );
        await fs.promises.unlink(localImagePath);
      }
    } catch (error) {
      console.error("Error deleting old files:", error);
    }
    await Menu.findByIdAndDelete(itemId);

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "MenuItem Deleted Successfully"));
  }
});

export { createItem, getAllItems, updateItem, updateItemImage, deleteItem };
