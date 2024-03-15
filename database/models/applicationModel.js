import mongoose, { Schema, Types } from "mongoose";

let applicationSchema = new Schema(
  {
    jobId: { type: Types.ObjectId, ref: "Job" },
    userId: { type: Types.ObjectId, ref: "User" },
    technicalSkills: [{ type: String, required: true }],
    softSkills: [{ type: String, required: true }],
    resume: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
    company: { type: Types.ObjectId, ref: "Company", required: true },
  },
  { timestamps: true }
);

export let Application = mongoose.model("Application", applicationSchema);
