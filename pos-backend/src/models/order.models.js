import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const ORDER_STATUSES = ["Pending", "Ready", "Completed", "Cancelled"];

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        menuId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Menu",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          // table
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ORDER_STATUSES,
      default: "Pending",
    },
    owner:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    table : {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

orderSchema.plugin(mongooseAggregatePaginate)

export const Order = mongoose.model("Order", orderSchema);
