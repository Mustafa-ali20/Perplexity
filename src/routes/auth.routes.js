import { Router } from "express";
import { register, verifyEmail, login } from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../validator/auth.validator.js";

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
 * @desc Login a new user
 * @access Public
 * @body {username, email, password}
 */
authRouter.post("/login", loginValidator, login);



/**
 * @route GET /api/auth/verify-email
 * @desc Verify user's email address
 * @access Public
 * @query {token}
 */
authRouter.get("/verify-email", verifyEmail);

export default authRouter;
