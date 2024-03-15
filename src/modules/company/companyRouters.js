import { Router } from "express";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";
import { isAuthorized } from "../../middlewares/authorization.js";
import { validation } from "../../middlewares/validation.js";
import * as companyValidationSchemas from "./companyValidationSchemas.js";
import * as companyControllers from "./companyControllers.js";

let router = Router();

//add company
router.post(
  "/addCompany",
  isAuthenticated,
  isAuthorized("Company_HR"),
  validation(companyValidationSchemas.addCompany),
  companyControllers.addCompany
);

//updateCompany
router.patch(
  "/updateCompany/:id",
  isAuthenticated,
  isAuthorized("Company_HR"),
  validation(companyValidationSchemas.updateCompany),
  companyControllers.updateCompany
);

//delete company
router.delete(
  "/deleteCompany/:id",
  isAuthenticated,
  isAuthorized("Company_HR"),
  validation(companyValidationSchemas.deleteCompany),
  companyControllers.deleteCompany
);

//get company data
router.get(
  "/getCompany/:id",
  isAuthenticated,
  isAuthorized("Company_HR"),
  validation(companyValidationSchemas.getCompany),
  companyControllers.getCompanyData
);

//search company by name
router.get(
  "/getCompanybyName",
  isAuthenticated,
  isAuthorized("User", "Company_HR"),
  validation(companyValidationSchemas.getCompanyByName),
  companyControllers.getCompanyByName
);

//getJobApplications
router.get(
  "/getJobApplications/:id",
  isAuthenticated,
  isAuthorized("Company_HR"),
  validation(companyValidationSchemas.getJobApplications),
  companyControllers.getJobApplications
);

export default router;
