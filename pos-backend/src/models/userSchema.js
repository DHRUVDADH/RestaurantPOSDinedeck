import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      required: true,
      type: String,
      unique: true,
      lowercase: true,
      index: true
    },
    username: {
      required: true,
      type: String,
      unique: true,
      trim: true,
      index: true
    },
    password: {
      required: [true, "Enter the Password"]],
      type: String,
    },
    userRole: {
      required: true,
      type: String,
      enum: [customer' , 'admin' , 'employee']],
    },
    orderHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
      }
    ],
    refreshToken: {
      type: String
    }
  }, { timestamps: true }
);
