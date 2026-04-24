import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["review", "complaint"],
      required: true,
    },
    image: {
      type: String,
      default: null, 
    },
    device_info: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export const Feedback = mongoose.model("Feedback", feedbackSchema);