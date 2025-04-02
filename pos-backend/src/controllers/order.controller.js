import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.models.js";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";

const createOrder = asyncHandler(async (req, res) => {
  const { items, totalPrice, table } = req.body;
  const { userId } = req.params; // Assuming userId is in route params

  if (
    !table ||
    totalPrice == null ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    throw new ApiError(
      400,
      "Table, total price, and at least one item are required."
    );
  }

  // Validate each item
  if (
    items.some(
      ({ menuId, price, quantity }) =>
        !menuId || price == null || quantity == null
    )
  ) {
    throw new ApiError(
      400,
      "Each item must have a valid menuId, price, and quantity."
    );
  }

  // Validate userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(404, "Invalid user ID.");
  }

  const userExist = await User.findById(userId);
  if (!userExist) {
    throw new ApiError(404, "User does not exist.");
  }

  // Create order
  const order = await Order.create({
    items,
    totalPrice,
    table,
    owner: userId, // Assigning the owner of the order
  });

  if (!order) {
    throw new ApiError(500, "Something went wrong while creating the order.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, order, "New order created successfully."));
});

const getOrders = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 3,
    sortBy = "table",
    sortType = -1,
    query,
  } = req.query;

  const aggregationPipeline = [];

  aggregationPipeline.push({
    $lookup: {
      from: "menus",
      localField: "items.menuId",
      foreignField: "_id",
      as: "menuDetails",
    },
  });

  if (query) {
    aggregationPipeline.push({
      $match: {
        $or: [
          { "menuDetails.itemName": { $regex: query, $options: "i" } },
          { orderStatus: { $regex: query, $options: "i" } },
        ],
      },
    });
  }

  aggregationPipeline.push({
    $sort: { [sortBy]: parseInt(sortType) },
  });

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const result = await Order.aggregatePaginate(
    Order.aggregate(aggregationPipeline),
    options
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "All Orders fetched Successfully."));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(404, "Order does not exist.");
  }
  const orderExist = await Order.findById(orderId);

  if (!orderExist) {
    throw new ApiError(401, "Enter  valid Order Id");
  }

  const { orderStatus } = req.body;

  if (!orderStatus) {
    throw new ApiError(401, "All Fields are required");
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    {
      $set: {
        orderStatus: orderStatus,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedOrder,
        "Successfully updated the orderStatus."
      )
    );
});

const deleteOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(404, "Order does not exist");
  }

  const OrderExist = await Order.findById(orderId);

  if (!OrderExist) {
    throw new ApiError(400, "Enter valid Order id");
  }

  await Order.findByIdAndDelete(orderId);

  return res
  .status(200)
  .json(new ApiResponse(200 , {} , "Order Deleted Successfully."))
});

export { createOrder, getOrders, updateOrderStatus, deleteOrder };
