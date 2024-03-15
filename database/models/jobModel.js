import mongoose, { Schema, Types } from "mongoose";

export let jobSchema = new Schema(
  {
    title: { type: String, required: true, min: 5, max: 20, unique: true },
    location: {
      type: String,
      required: true,
      enum: ["onsite", "remotely", "hybrid"],
    },
    workingTime: {
      type: String,
      required: true,
      enum: ["part-time", "full-time"],
    },
    seniorityLevel: {
      type: String,
      required: true,
      enum: ["Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"],
    },
    description: {
      type: String,
      required: true,
      min: 10,
      max: 100,
    },
    technicalSkills: [{ type: String, required: true }],
    softSkills: [{ type: String, required: true }],
    addedBy: { type: Types.ObjectId, ref: "User", required: true },
    company: { type: Types.ObjectId, ref: "Company", required: true },
  },
  { timestamps: true }
);

export let Job = mongoose.model("Job", jobSchema);
