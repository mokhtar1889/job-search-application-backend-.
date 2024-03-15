import mongoose, { Schema, Types } from "mongoose";

let companySchema = new Schema(
  {
    companyName: {
      type: String,
      required: [true, "company name is required"],
      max: [20, "company name must less than 20 characters "],
      unique: true,
    },
    description: {
      type: String,
      min: [20, "company description must greater than 10 characters "],
      max: [100, "company description must less than 100 characters "],
      required: [true, "company description is required"],
    },
    industry: {
      type: String,
      required: [true, "industry is required"],
      min: [20, "company industry must greated than 20 characters "],
      max: [100, "company industry must less than 100 characters "],
    },
    address: {
      type: String,
      required: [true, "address is required"],
      min: [10, "company address must great than 10 characters "],
      max: [100, "company address must less than 100 characters "],
    },
    numberOfEmployees: {
      type: String,
      required: [true, "number of employees is required"],
      validate: /\d-\d/,
    },
    companyEmail: {
      type: String,
      required: [true, "company email is required"],
      unique: true,
    },
    companyHR: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "company HR is required"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//jobs virtual field
companySchema.virtual("jobs", {
  ref: "Job",
  localField: "_id",
  foreignField: "company",
});

export let Company = mongoose.model("Company", companySchema);
