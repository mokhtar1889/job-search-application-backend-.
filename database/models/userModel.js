import mongoose, { Schema, Types } from "mongoose";

let userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "first name is required"],
      min: 3,
      max: 20,
    },
    lastName: {
      type: String,
      required: [true, "last name is  required"],
      min: 3,
      max: 20,
    },
    username: { type: String, required: [true, "user name is required"] },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: { type: String, required: [true, "password is required"] },
    recoveryEmail: {
      type: String,
      required: [true, "recovery email is required"],
    },
    dateOfBirth: { type: Date, required: [true, "date of birth is required"] },
    mobileNumber: {
      type: String,
      required: [true, "mobile number is required"],
      unique: true,
      validate: /^01[0-2,5]\d{8}$/,
    },
    company: {
      type: Types.ObjectId,
      ref: "Company",
    },
    role: { type: String, enum: ["User", "Company_HR"], default: "User" },
    status: { type: String, enum: ["online", "offline"], default: "offline" },
    resetCode: { type: String, length: 5 },
  },
  {
    timestamps: true,
  }
);

export let User = mongoose.model("User", userSchema);
