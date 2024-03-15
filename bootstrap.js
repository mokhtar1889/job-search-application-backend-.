import { connectDb } from "./database/connection/connection.js";
import express from "express";
import { globalErrorHandler } from "./util/globalErrorHandler.js";
import { notFoundPage } from "./util/notFoundPage.js";
import authRouters from "./src/modules/auth/authRouters.js";
import companyRouters from "./src/modules/company/companyRouters.js";
import jobRouters from "./src/modules/job/jobRouters.js";

export let bootstrap = async (app) => {
  await connectDb();
  app.use(express.json());
  app.use("/auth", authRouters);
  app.use("/company", companyRouters);
  app.use("/job", jobRouters);
  app.use(globalErrorHandler);
  app.all("*", notFoundPage);
};
