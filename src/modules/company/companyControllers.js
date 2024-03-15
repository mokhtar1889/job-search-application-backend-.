import { asyncHandler } from "../../../util/asyncHandler.js";
import { Company } from "../../../database/models/companyModel.js";
import { Application } from "../../../database/models/applicationModel.js";
import { Job } from "../../../database/models/jobModel.js";

//add company
export let addCompany = asyncHandler(async (req, res, next) => {
  //data
  let {
    companyName,
    description,
    industry,
    address,
    companyEmail,
    numberOfEmployees,
  } = req.body;

  let user = req.user;

  //check company existanse
  let company = await Company.findOne({ companyName });
  if (company)
    return next(new Error("company is already exists", { cause: 400 }));

  //check if user work for company
  if (req.user.company)
    return next(
      new Error("this user is already working for a company", { cause: 400 })
    );

  // add company to data base
  let response = await Company.create({
    companyName,
    description,
    industry,
    address,
    companyEmail,
    companyHR: user._id,
    numberOfEmployees,
  });

  //add company to user
  user.company = response._id;
  await user.save();

  // response
  return res.json({ sucess: true, message: "company added successfully" });
});

//update company
export let updateCompany = asyncHandler(async (req, res, next) => {
  //data
  let {
    companyName,
    description,
    industry,
    address,
    companyEmail,
    numberOfEmployees,
  } = req.body;
  let user = req.user;

  //check if company exists
  let company = await Company.findById(req.params.id);
  if (!company) return next(new Error("company is not exists", { cause: 400 }));

  //check the ownership of the company
  if (user.id.toString() !== company.companyHR.toString())
    return next(
      new Error("only the owner of the company is allowed to update it", {
        cause: 400,
      })
    );
  //update data
  company.companyName = companyName ? companyName : company.companyName;
  company.description = description ? description : company.description;
  company.industry = industry ? industry : company.industry;
  company.address = address ? address : company.address;
  company.companyEmail = companyEmail ? companyEmail : company.companyEmail;
  company.numberOfEmployees = numberOfEmployees
    ? numberOfEmployees
    : company.numberOfEmployees;

  await company.save();

  //response
  return res.json({ success: true, message: "company updated successfully" });
});

//delete Company
export let deleteCompany = asyncHandler(async (req, res, next) => {
  let user = req.user;
  //check if company exists
  let company = await Company.findById(req.params.id);
  if (!company) return next(new Error("company is not exists", { cause: 400 }));

  //check the ownership of the company
  if (user.id.toString() !== company.companyHR.toString())
    return next(
      new Error("only the owner of the company is allowed to update it", {
        cause: 400,
      })
    );

  // delete all jobs related to company
  let jobs = await Job.deleteMany({ company: company._id });

  //delete all applications related to job
  let applications = await Application.deleteMany({
    company: company._id,
  });

  //delete company from databse
  let response = await Company.findByIdAndDelete(req.params.id);

  // delete company from user
  await user.updateOne({
    $unset: { company: 1 },
  });

  //response
  return res.json({ success: true, message: "company deleted successfully" });
});

//get company data
export let getCompanyData = asyncHandler(async (req, res, next) => {
  //check company
  let company = await Company.findById(req.params.id).populate({
    path: "jobs",
    select: "-_id -createdAt -updatedAt -__v",
  });
  if (!company) return next(new Error("company is not exists", { cause: 404 }));

  //response
  return res.json({ success: true, company });
});

// get company by name
export let getCompanyByName = asyncHandler(async (req, res, next) => {
  //check company
  let company = await Company.findOne({
    companyName: req.body.companyName,
  }).populate({ path: "jobs", select: "-_id -createdAt -updatedAt -__v" });

  if (!company) return next(new Error("company is not exists", { cause: 404 }));

  //response
  return res.json({ success: true, company });
});

//Get all applications for specific Jobs
export let getJobApplications = asyncHandler(async (req, res, next) => {
  //check job
  let job = await Job.findById(req.params.id);
  if (!job) return next(new Error("job is not exists!", { cause: 404 }));

  //check owner
  if (req.user._id.toString() != job.addedBy.toString())
    return next(
      new Error("only the job owner can view all applications job", {
        cause: 401,
      })
    );

  let applications = await Application.find({ jobId: req.params.id }).populate({
    path: "userId",
    select: "-createdAt -updatedAt -__v -password -recoveryEmail -status",
  });

  if (applications.length == 0)
    return res.json({
      message: "there is no applications applied to this job",
    });

  //response
  res.json({
    success: true,
    numberOfApplications: applications.length,
    applications,
  });
});
