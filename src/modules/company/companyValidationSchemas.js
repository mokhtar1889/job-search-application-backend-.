import joi from "joi";
import { Types } from "mongoose";

//add company
export let addCompany = joi
  .object({
    companyName: joi.string().required().max(20),
    description: joi.string().required().min(20).max(100),
    industry: joi.string().required().min(20).max(100),
    address: joi.string().required().min(10).max(100),
    companyEmail: joi.string().email().required(),
    numberOfEmployees: joi.string().required().pattern(/\d-\d/).messages({
      "string.pattern.base":
        "please enter the number of employees in this manar ex:200-100",
    }),
  })
  .required();

//updateCompany
export let updateCompany = joi
  .object({
    companyName: joi.string().max(20),
    description: joi.string().min(20).max(100),
    industry: joi.string().min(20).max(100),
    address: joi.string().min(10).max(100),
    companyEmail: joi.string().email(),
    numberOfEmployees: joi.string().pattern(/\d-\d/).messages({
      "string.pattern.base":
        "please enter the number of employees in this manar ex:200-100",
    }),
    //company id from params
    id: joi.custom((value, helper) => {
      if (Types.ObjectId.isValid(value)) return true;
      return helper.message("invalid company id");
    }),
  })
  .required();

//deleteCompany
export let deleteCompany = joi
  .object({
    id: joi.custom((value, helper) => {
      if (Types.ObjectId.isValid(value)) return true;
      return helper.message("invalid company id");
    }),
  })
  .required();

//get Company data
export let getCompany = joi
  .object({
    id: joi.custom((value, helper) => {
      if (Types.ObjectId.isValid(value)) return true;
      return helper.message("invalid company id");
    }),
  })
  .required();

// getCompanyByName
export let getCompanyByName = joi
  .object({
    companyName: joi.string().required().max(20),
  })
  .required();

//getJobApplications
export let getJobApplications = joi
  .object({
    id: joi.custom((value, helper) => {
      if (Types.ObjectId.isValid(value)) return true;
      return helper.message("invalid company id");
    }),
  })
  .required();
