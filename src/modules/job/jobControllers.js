import { asyncHandler } from "../../../util/asyncHandler.js";
import { Company } from "../../../database/models/companyModel.js";
import { Job } from "../../../database/models/jobModel.js";
import cloudinary from "../../../util/cloudinary.js";
import { Application } from "../../../database/models/applicationModel.js";

//add job
export let addJob = asyncHandler(async (req, res, next) => {
  //check company
  let company = await Company.findById(req.user.company);
  if (!company)
    return next(new Error("company is not exists!", { cuase: 404 }));

  //check owner
  if (req.params.id.toString() != req.user.company._id.toString())
    return next(
      new Error("only the HR of this company can add job", { cause: 401 })
    );

  //check job
  let jobDB = await Job.findOne({ title: req.body.title });
  if (jobDB)
    return next(new Error("this job is already exists!", { cause: 400 }));

  // add job to databse
  let job = await Job.create({
    ...req.body,
    addedBy: req.user._id,
    company: company._id,
  });

  //response
  return res.json({ success: true, message: "job added successfully" });
});

//update job
export let updateJob = asyncHandler(async (req, res, next) => {
  let {
    title,
    location,
    seniorityLevel,
    description,
    technicalSkills,
    softSkills,
  } = req.body;
  //check job
  let job = await Job.findById(req.params.id);
  if (!job) return next(new Error("job is not exists!", { cause: 404 }));

  //check owner
  if (req.user._id.toString() != job.addedBy.toString())
    return next(new Error("only job owner can update it", { cause: 400 }));

  //update job
  job.title = title ? title : job.title;
  job.location = location ? location : job.location;
  job.seniorityLevel = seniorityLevel ? seniorityLevel : job.seniorityLevel;
  job.description = description ? description : job.description;
  job.technicalSkills = technicalSkills ? technicalSkills : job.technicalSkills;
  job.softSkills = softSkills ? softSkills : job.softSkills;
  job.save();

  //response
  return res.json({ success: true, message: "job updated successfullt" });
});

//delete job
export let deleteJob = asyncHandler(async (req, res, next) => {
  //check job
  let job = await Job.findById(req.params.id);
  if (!job) return next(new Error("job is not exists!", { cause: 404 }));

  //check owner
  if (req.user._id.toString() != job.addedBy.toString())
    return next(new Error("only job owner can delete it", { cause: 400 }));

  // delete applications related to job
  let jobs = await Application.deleteMany({ jobId: job._id });

  //delete job
  let response = await job.deleteOne();

  if (response)
    return res.json({ success: true, message: "job deleted successfully" });
});

//get all jobs with their company information
export let getAllJobs = asyncHandler(async (req, res, next) => {
  let jobs = await Job.find().populate({
    path: "company",
    select: "-_id -jobs -createdAt -updatedAt -__v",
  });
  //response
  return res.json({ success: true, numberOfJobs: jobs.length, jobs });
});

//get all jobs for spicific company
export let getCompanyJobs = asyncHandler(async (req, res, next) => {
  //check company
  let company = await Company.findOne({ companyName: req.query.name });
  if (!company)
    return next(new Error("company is not exists!", { cause: 404 }));

  //get jobs
  let jobs = await Job.find({ company: company._id });
  if (jobs.length == 0)
    return res.json({ message: "this company has no available jobs" });
  //response
  return res.json({ success: true, numberOfJobs: jobs.length, jobs });
});

//job filter
export let jobFilter = asyncHandler(async (req, res, next) => {
  let jobs = await Job.find({
    ...req.body,
  });

  if (jobs.length == 0)
    return res.json({ message: "no job matchs these criteria" });

  //response
  res.json({ success: true, numberOfJobs: jobs.length, jobs });
});

//apply job
export let applyJob = asyncHandler(async (req, res, next) => {
  //resume
  let resume = req.file;

  //check job
  let job = await Job.findById(req.params.id);
  if (!job) return next(new Error("job is not exists!", { cause: 404 }));

  //check file
  if (!resume) return next(new Error("resume is required!", { cause: 400 }));

  // check if user applied before
  let applicationDb = await Application.find({
    $and: [{ userId: req.user._id }, { jobId: req.params.id }],
  });

  if (applicationDb.length != 0)
    return next(
      new Error("you have already applied to this job", { cause: 400 })
    );

  //upload resume to cloudinary
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    resume.path,
    {
      folder: `jobSearch/resumes`,
    }
  );

  // add application to database
  let application = await Application.create({
    jobId: req.params.id,
    userId: req.user._id,
    technicalSkills: req.body.technicalSkills,
    softSkills: req.body.softSkills,
    company: job.company,
    resume: { id: public_id, url: secure_url },
  });

  if (application)
    return res.json({ success: true, message: "job applied sucessfully" });
});
