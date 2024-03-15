import joi from "joi";
import { Types } from "mongoose";

//add job
export let addJob = joi
  .object({
    title: joi.string().min(5).max(20).required(),
    location: joi.string().required().valid("onsite", "remotely", "hybrid"),
    workingTime: joi.string().required().valid("full-time", "part-time"),
    seniorityLevel: joi
      .string()
      .required()
      .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
    description: joi.string().required().min(10).max(100),
    technicalSkills: joi.array().items(joi.string()).required(),
    softSkills: joi.array().items(joi.string()).required(),
    id: joi
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) return true;
        return helper.message("invalid job id ");
      })
      .required(),
  })
  .required();

//updateJob
export let updateJob = joi
  .object({
    title: joi.string().min(5).max(20),
    location: joi.string().valid("onsite", "remotely", "hybrid"),
    workingTime: joi.string().valid("full-time", "part-time"),
    seniorityLevel: joi
      .string()
      .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
    description: joi.string().min(10).max(100),
    technicalSkills: joi.array().items(joi.string()),
    softSkills: joi.array().items(joi.string()),
    id: joi
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) return true;
        return helper.message("invalid job id ");
      })
      .required(),
  })
  .required();

//deleteJob
export let deleteJob = joi
  .object({
    id: joi
      .string()
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) return true;
        return helper.message("invalid job id ");
      })
      .required(),
  })
  .required();

//getCompanyJobs
export let getCompanyJobs = joi
  .object({
    name: joi.string().max(20).required(),
  })
  .required();

//jobFilter
export let jobFilter = joi
  .object({
    title: joi.string().min(5).max(20),
    location: joi.string().valid("onsite", "remotely", "hybrid"),
    workingTime: joi.string().valid("full-time", "part-time"),
    seniorityLevel: joi
      .string()
      .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
    description: joi.string().min(10).max(100),
    technicalSkills: joi.array().items(joi.string()),
    softSkills: joi.array().items(joi.string()),
  })
  .required();

//applyToJob
export let applyJob = joi
  .object({
    id: joi
      .string()
      .custom((value, helper) => {
        if (Types.ObjectId.isValid(value)) return true;
        return helper.message("invalid job id ");
      })
      .required(),
    technicalSkills: joi.array().items(joi.string()),
    softSkills: joi.array().items(joi.string()),
  })
  .required();
