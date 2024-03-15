import { asyncHandler } from "./../../../util/asyncHandler.js";
import { User } from "../../../database/models/userModel.js";
import { Token } from "../../../database/models/tokenModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "./../../../util/sendEmail.js";
import randomstring from "randomstring";
import { Company } from "./../../../database/models/companyModel.js";
import { Job } from "./../../../database/models/jobModel.js";
import { Application } from "./../../../database/models/applicationModel.js";

//signup
export let signup = asyncHandler(async (req, res, next) => {
  //date from body
  let {
    firstName,
    lastName,
    email,
    password,
    recoveryEmail,
    mobileNumber,
    dateOfBirth,
    role,
  } = req.body;

  //check email
  let user = await User.findOne({ email });
  if (user) return next(new Error("user is already exists", { cause: 400 }));

  //hash password
  let hashPassword = bcryptjs.hashSync(
    password,
    parseInt(process.env.SALT_ROUND)
  );

  //add user to data base
  let response = await User.create({
    firstName,
    lastName,
    username: `${firstName} ${lastName}`,
    email,
    password: hashPassword,
    mobileNumber,
    recoveryEmail,
    dateOfBirth,
    role,
  });
  if (response)
    return res.json({ success: true, message: "user added successfully" });
});

//signin
export let signin = asyncHandler(async (req, res, next) => {
  let { emailOrPhoneNumber, password } = req.body;

  //check user
  let user = await User.findOne({
    $or: [{ email: emailOrPhoneNumber }, { mobileNumber: emailOrPhoneNumber }],
  });
  if (!user) return next(new Error("user is not exists!", { cause: 404 }));

  //check password
  let isMatch = bcryptjs.compareSync(password, user.password);
  if (!isMatch) return next(new Error("invalid password"), { cause: 400 });

  //generate token
  let token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.TOKEN_SECRET
  );

  // add token to token model
  await Token.create({
    token,
    user: user._id,
    agent: req.headers["user-agent"],
  });

  // change status of the user to online
  user.status = "online";
  await user.save();

  //response
  res.json({ success: true, message: `welcome ${user.username}`, token });
});

//update user
export let updateUser = asyncHandler(async (req, res, next) => {
  //data to update from body
  let { firstName, lastName, email, recoveryEmail, mobileNumber, dateOfBirth } =
    req.body;

  //user from auth middleware
  let user = req.user;

  // check user existance
  let userDB = await User.findById(user._id);
  if (!userDB) return next(new Error("user is not exists!", { cause: 404 }));

  //check if the updated email is exists
  let isEmailExists = await User.findOne({ email });
  if (isEmailExists)
    return next(new Error("email is already exists!"), { cause: 401 });

  //check if the updated mobile number is exists
  let isMobileNumberExists = await User.findOne({ mobileNumber });
  if (isMobileNumberExists)
    return next(new Error("mobile number is already exists!", { cause: 401 }));

  //update data
  user.firstName = firstName ? firstName : user.firstName;
  user.lastName = lastName ? lastName : user.lastName;
  user.username = `${user.firstName} ${user.lastName}`;
  user.email = email ? email : user.email;
  user.recoveryEmail = recoveryEmail ? recoveryEmail : user.recoveryEmail;
  user.mobileNumber = mobileNumber ? mobileNumber : user.mobileNumber;
  user.dateOfBirth = dateOfBirth ? dateOfBirth : user.dateOfBirth;
  await user.save();

  //response
  return res.json({
    success: true,
    message: "user updated successfully",
  });
});

//deleteUser
export let deleteUser = asyncHandler(async (req, res, next) => {
  let user = req.user;

  if (user.role == "Company_HR") {
    //delete applications related to jobs related to user
    let deleteApplications = await Application.deleteMany({
      company: user.company,
    });

    //delete jobs releted to user
    let deleteJob = await Job.deleteMany({ addedBy: user._id });

    // delete company related to user
    let deleteCompany = await Company.findOneAndDelete({
      companyHR: user._id,
    });
  }

  if (user.role == "User") {
    //delete all applications related to user
    let deleteApplication = await Application.deleteMany({
      userId: user._id,
    });
  }

  //delete user
  let response = await User.findOneAndDelete({ _id: user._id });

  //invalidate tokens
  await Token.updateMany({ user: user._id }, { isValid: false });

  //response
  return res.json({ success: true, message: "user deleted successfully" });
});

//get user account data
export let getUserData = asyncHandler(async (req, res, next) => {
  let user = req.user;

  //check user existance
  let userData = await User.findById(user._id)
    .select("-password  -status -createdAt -updatedAt -__v")
    .populate({
      path: "company",
      select: "companyName",
    });

  //response
  return res.json({ success: true, user: userData });
});

//Get profile data for another user
export let getAnotherUserData = asyncHandler(async (req, res, next) => {
  //user id from params
  let { id } = req.params;

  //check user existance
  let user = await User.findById(id).select(
    "-password -_id -status -createdAt -updatedAt -__v -recoveryEmail"
  );
  if (!user) return next(new Error("user is not exists", { cause: 404 }));

  //response
  return res.json({ success: true, user });
});

//update password
export let updatePassword = asyncHandler(async (req, res, next) => {
  //data from body
  let { oldPassword, newPassword } = req.body;

  let user = req.user;

  //check password
  let isMatched = bcryptjs.compareSync(oldPassword, user.password);
  if (!isMatched) return next(new Error("invalid password", { cause: 400 }));

  //hash new password
  let hashPassword = bcryptjs.hashSync(
    newPassword,
    parseInt(process.env.SALT_ROUND)
  );

  //update password in database
  user.password = hashPassword;
  await user.save();

  //invalidate token
  let token = await Token.updateMany({ user: user._id }, { isValid: false });
  console.log(token);

  //response
  return res.json({ success: true, message: "password updated successfully" });
});

//Get all accounts associated to a specific recovery Email
export let getAccountsByRecoveryEmail = asyncHandler(async (req, res, next) => {
  let { recoveryEmail } = req.params;
  let users = await User.find({ recoveryEmail });
  if (users.length == 0)
    return res.json({
      message: "no accounts assossiated to this recovery email",
    });
  //response
  res.json({
    success: true,
    numberOfUsersAccounts: users.length,
    Usersaccounts: users,
  });
});

//forgetPassword
export let forgetPassword = asyncHandler(async (req, res, next) => {
  let { email } = req.body;

  //check email
  let user = await User.findOne({ email });

  if (!user) return next(new Error("this user is not exists!", { cause: 404 }));

  // generate the reset code
  let resetCode = randomstring.generate({
    length: 5,
    charset: "numeric",
  });

  let html = `<div>
      <h2>password recover code is</h2>
      <h3>${resetCode}</h3>
    </div>`;

  // send message to email
  let emailSent = sendEmail({
    to: user.email,
    subject: "recover password code",
    html,
  });

  // put resetCode code in the data base
  user.resetCode = resetCode;
  await user.save();

  if (!emailSent) return next(new Error("email is not sent", { cause: 404 }));

  return res.json({
    success: true,
    message: "reset code has been sent to your email successfully",
  });
});

//reset password
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email, resetCode, password, confirmPassword } = req.body;

  // check if the email exists
  let user = await User.findOne({ email });
  if (!user) return next(new Error("user is not exist!"));

  if (user.resetCode !== resetCode)
    return next(new Error("invalid reset code", { cause: 400 }));

  //hash the new password
  let hashPassword = bcryptjs.hashSync(
    password,
    parseInt(process.env.SALT_ROUND)
  );

  //save the new password in the database
  user.password = hashPassword;

  // remove the  the reset code from the database
  await User.findOneAndUpdate(
    { email: user.email },
    { $unset: { resetCode: 1 } }
  );
  await user.save();

  // make all tokens belongs to the user is invalid
  let tokens = await Token.find({ user: user._id });

  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });

  res.json({
    success: true,
    message: "password has been reseted successfully",
  });
});

//logout
export const logout = asyncHandler(async (req, res, next) => {
  const user = req.user;

  //change status to offline
  user.status = "offline";
  user.save();

  //invalidate user token
  await Token.updateMany({ user: user._id, isValid: true }, { isValid: false });

  return res.json({ success: true, message: `${user.username} is logged out` });
});
