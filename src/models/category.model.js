import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // admin bo‘ladi
    },
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);