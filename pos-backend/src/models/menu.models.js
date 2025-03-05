import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const menuSchema = new mongoose.Schema(
  {
    itemName: {
      unique: true,
      type: String,
      required: true,
    },
    itemDesc: {
      type: String,
    },
    itemPrice: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    itemCategory: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    itemAvailability: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    dealType: {
      type: String,
      required: true,
      enum: ["Normal Menu", "Special Deals", "New Year Deals"],
    },
  },
  { timestamps: true }
);

menuSchema.plugin(mongooseAggregatePaginate);

export const Menu = mongoose.model("Menu", menuSchema);
