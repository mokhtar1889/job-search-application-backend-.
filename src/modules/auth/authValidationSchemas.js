import joi from "joi";

import { Types } from "mongoose";

//signUp
export let signup = joi
  .object({
    firstName: joi.string().max(20).min(3).alphanum().required(),
    lastName: joi.string().max(20).min(3).alphanum().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().required().valid(joi.ref("password")),
    recoveryEmail: joi.string().email().required(),
    dateOfBirth: joi.date().required(),
    mobileNumber: joi
      .string()
      .required()
      .pattern(/^01[0-2,5]\d{8}$/),
    role: joi.string().valid("User", "Company_HR"),
  })
  .required();

//signin
export let signin = joi
  .object({
    emailOrPhoneNumber: joi.string().required(),
    password: joi.string().required(),
  })
  .required();

//update user
export let updateUser = joi
  .object({
    //body
    firstName: joi.string().max(20).min(3),
    lastName: joi.string().max(20).min(3),
    email: joi.string().email(),
    mobileNumber: joi.string().pattern(/^01[0-2,5]\d{8}$/),
    recoveryEmail: joi.string().email(),
    dateOfBirth: joi.date(),
  })
  .required();

//update password
export let updatePassword = joi
  .object({
    oldPassword: joi.string().required(),
    newPassword: joi.string().required(),
    confirmNewPassword: joi.string().valid(joi.ref("newPassword")).required(),
  })
  .required();

//getAccountsByRecoveryEmail
export let getAccountsByRecoveryEmail = joi
  .object({
    recoveryEmail: joi.string().email().required(),
  })
  .required();

//forget password
export let forgetPassword = joi
  .object({
    email: joi.string().email().required(),
  })
  .required();

//reset password
export let resetPassword = joi
  .object({
    email: joi.string().email().required(),
    resetCode: joi.string().length(5).required(),
    password: joi.string().required(),
    confirmPassword: joi.string().valid(joi.ref("password")).required(),
  })
  .required();
