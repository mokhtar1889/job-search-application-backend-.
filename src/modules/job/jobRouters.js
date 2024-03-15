import { Router } from "express";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";
import { isAuthorized } from "../../middlewares/authorization.js";
import * as jobValidationSchemas from "./jobValidationSchemas.js";
import { validation } from "./../../middlewares/validation.js";
import * as jobControllers from "./jobControllers.js";
import { uploadFile } from "./../../../util/multer.js";

let router = Router();

//add job
router.post(
  "/addJob/:id",
  isAuthenticated,
  isAuthorized("Company_HR"),
  validation(jobValidationSchemas.addJob),
  jobControllers.addJob
);

//update job
router.patch(
  "/updateJob/:id",
  isAuthenticated,
  isAuthorized("Company_HR"),
  validation(jobValidationSchemas.updateJob),
  jobControllers.updateJob
);

//delete job
router.delete(
  "/deleteJob/:id",
  isAuthenticated,
  isAuthorized("Company_HR"),
  validation(jobValidationSchemas.deleteJob),
  jobControllers.deleteJob
);

//get all jobs with their company information
router.get(
  "/getAllJobs",
  isAuthenticated,
  isAuthorized("Company_HR", "User"),
  jobControllers.getAllJobs
);

//Get all Jobs for a specific company
router.get(
  "/getCompanyJobs",
  isAuthenticated,
  isAuthorized("Company_HR", "User"),
  validation(jobValidationSchemas.getCompanyJobs),
  jobControllers.getCompanyJobs
);

//Get all Jobs that match the following filters
router.get(
  "/jobFilter",
  isAuthenticated,
  isAuthorized("Company_HR", "User"),
  validation(jobValidationSchemas.jobFilter),
  jobControllers.jobFilter
);

//apply to job
router.post(
  "/applyJob/:id",
  isAuthenticated,
  isAuthorized("User"),
  validation(jobValidationSchemas.applyJob),
  uploadFile().single("resume"),
  jobControllers.applyJob
);

export default router;
