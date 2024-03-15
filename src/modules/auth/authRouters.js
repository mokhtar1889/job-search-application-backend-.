import { Router } from "express";
import * as authControllers from "./authControllers.js";
import { validation } from "../../middlewares/validation.js";
import * as authValidationSchemas from "./authValidationSchemas.js";
import { isAuthenticated } from "../../middlewares/authMiddleware.js";

let router = Router();

//signup
router.post(
  "/signup",
  validation(authValidationSchemas.signup),
  authControllers.signup
);

//signin
router.post(
  "/signin",
  validation(authValidationSchemas.signin),
  authControllers.signin
);

//update user
router.patch(
  "/update",
  isAuthenticated,
  validation(authValidationSchemas.updateUser),
  authControllers.updateUser
);

//delete user
router.delete("/deleteUser", isAuthenticated, authControllers.deleteUser);

//get user account data
router.get("/getUserData", isAuthenticated, authControllers.getUserData);

// Get profile data for another user
router.get(
  "/getAnotherUserData/:id",
  isAuthenticated,
  validation(authValidationSchemas.getUserData),
  authControllers.getAnotherUserData
);

//update password
router.patch(
  "/updatePassword",
  isAuthenticated,
  validation(authValidationSchemas.updatePassword),
  authControllers.updatePassword
);

//Get all accounts associated to a specific recovery Email
router.get(
  "/getAccountsByRecoveryEmail/:recoveryEmail",
  isAuthenticated,
  validation(authValidationSchemas.getAccountsByRecoveryEmail),
  authControllers.getAccountsByRecoveryEmail
);

//forget password
router.patch(
  "/forgetPassword",
  validation(authValidationSchemas.forgetPassword),
  authControllers.forgetPassword
);

//10-reset password
router.patch(
  "/resetPassword",
  validation(authValidationSchemas.resetPassword),
  authControllers.resetPassword
);

//11-logout
router.patch("/logout", isAuthenticated, authControllers.logout);

export default router;
