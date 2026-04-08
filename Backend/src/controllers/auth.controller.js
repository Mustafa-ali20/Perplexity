import userModel from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import { sendEmail } from "../services/mail.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await userModel.findOne({ email }, { username });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  const user = await userModel.create({
    username,
    email,
    password,
  });

  const emailVerificationToken = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "2d" },
  );

  const verifyUrl = `${process.env.CLIENT_URL}/api/auth/verify-email?token=${emailVerificationToken}`;

  await sendEmail({
    to: email,
    subject: "Welcome to Perplexity!",
    html: `
    <p>Hi ${username},</p>
    <p>Thank you for registering at <strong>Perplexity</strong>. We're excited to have you on board!</p>
    <a href="${verifyUrl}">Verify Email</a>
    <p>If you didn't create an account, please ignore this email.</p>
    <p>Best regards,<br>The Perplexity Team</p>
  `,
  });

  res.status(201).json({
    message:
      "Registration successful. Please check your email to verify your account.",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  const user = await userModel.findOne(
    isEmail(identifier) ? { email: identifier } : { username: identifier },
  );

  if (!user) {
    res.status(400);
    throw new Error("Invalid credentials");
  }

  if (!user.verified) {
    res.status(400);
    throw new Error("Email isnt verifed, please verify it before logging in");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(400);
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("token", token);

  res.status(200).json({
    success: true,
    message: "Login sucessfull",
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "user details fetched successfully",
    success: true,
    user: req.user,
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await userModel.findOne({ email: decoded.email });

  //added by claude to check if token is missing in query - right now if someone hits the endpoint without a token it crashes
  if (!token) {
    res.status(400);
    throw new Error("Verification token is missing");
  }

  if (!user) {
    return res.status(400).json({
      message: "Invalid token",
      success: false,
      err: "usernot found",
    });
  }
  // added my claude to check if the user has already verified
  if (user.verified) {
    return res.status(400).json({
      success: false,
      message: "Email is already verified",
    });
  }

  user.verified = true;
  await user.save();

  const html = `
    <h1>Email verified successfully</h1>
    <p>Your email has been verified. You can now log into your account</p>
    <a href="http://localhost:3000/login">Go to Login</a>
    `;

  res.status(200).send(html);
});
