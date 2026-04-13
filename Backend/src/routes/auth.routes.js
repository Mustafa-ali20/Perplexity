import { Router } from "express";
import {
  register,
  verifyEmail,
  login,
  getMe,
  logout,
} from "../controllers/auth.controller.js";
import {
  registerValidator,
  loginValidator,
} from "../validator/auth.validator.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Regisetr a new user
 * @access Public
 * @body {username, email, password}
 * @returns {user: {id, username, email} token}
 */
authRouter.post("/register", registerValidator, register);

/**
 * @route POST /api/auth/login
 * @desc Get current logged in user's details
 * @access Private
 */
authRouter.post("/login", loginValidator, login);

/**
 * @route GET /api/auth/get-me
 * @desc Login a new user
 * @access Public
 * @body {username, email, password}
 */
authRouter.get("/get-me", authMiddleware, getMe);

/**
 * @route GET /api/auth/verify-email
 * @desc Verify user's email address
 * @access Public
 * @query {token}
 */
authRouter.get("/verify-email", verifyEmail);

/**
 * @route POST /api/auth/logout
 * @desc Logout user by clearing the token cookie
 * @access Private
 */
authRouter.post("/logout", authMiddleware, logout);

export default authRouter;
