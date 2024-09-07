import mongoose, { Schema } from "mongoose";

const MultipleImage = new Schema(
  {
    images: {
      required: true,
      unique: true,
      type: [String],
    },
  },
  { timestamps: true }
);

export const Images = mongoose.model("imaginary", MultipleImage);
