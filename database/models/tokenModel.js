import mongoose, { Schema, Types } from "mongoose";

let tokenSchema = new Schema(
  {
    token: { type: String, required: [true, "token is required"] },
    isValid: {
      type: Boolean,
      default: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "user  is required"],
    },
    agent: String,
  },
  {
    timestamps: true,
  }
);

export let Token = mongoose.model("Token", tokenSchema);
