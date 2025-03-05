import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index : true,
    },
    description: {
      type: String,
      trim: true,
    },
    image1: {
      type: String, // Optional: If categories have icons or images
      required : true
    },
    image2: {
      type: String, // Optional: If categories have icons or images
      required : true
    },
    isActive: {
      type: Boolean,
      default: true, // Allow enabling/disabling categories
    },
  },
  { timestamps: true }
);

categorySchema.plugin(mongooseAggregatePaginate)

export const Category = mongoose.model("Category", categorySchema);
