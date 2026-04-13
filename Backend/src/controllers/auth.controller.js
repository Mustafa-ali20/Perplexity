import userModel from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import { sendEmail } from "../services/mail.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await userModel.findOne({ email });
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

  const verifyUrl = `${process.env.CLIENT_URL}/verified?token=${emailVerificationToken}`;

  await sendEmail({
    to: email,
    subject: "Verify your Perplexity account",
    html: `
    <div style="font-family: 'Courier New', monospace; background: #f4f6f8; padding: 40px 20px;">
      <div style="max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 6px; overflow: hidden; border: 1px solid #e2e8f0;">
        
        <!-- header -->
        <div style="padding: 28px 40px; background: #080e10; border-bottom: 3px solid #31b8c6;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: #31b8c6;"></div>
            <span style="color: #ffffff; font-size: 15px; font-weight: 700; letter-spacing: 0.04em;">Perplexity</span>
          </div>
        </div>

        <!-- body -->
        <div style="padding: 36px 40px;">
          <p style="color: #64748b; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; margin: 0 0 12px;">Email Verification</p>
          <h1 style="color: #0f172a; font-size: 22px; font-weight: 700; margin: 0 0 16px; letter-spacing: -0.01em;">Hey ${username} 👋</h1>
          <p style="color: #475569; font-size: 14px; line-height: 1.8; margin: 0 0 8px;">
            Thanks for creating a Perplexity account. Please verify your email address to get started.
          </p>
          <p style="color: #94a3b8; font-size: 13px; line-height: 1.8; margin: 0 0 32px;">
            This link will expire in <strong style="color: #31b8c6;">48 hours</strong>.
          </p>

          <!-- button -->
          <a href="${verifyUrl}" style="display: inline-block; background: #31b8c6; color: #ffffff; text-decoration: none; padding: 13px 32px; border-radius: 5px; font-size: 13px; font-weight: 700; letter-spacing: 0.06em;">
            Verify my email →
          </a>

          <!-- divider -->
          <div style="height: 1px; background: #e2e8f0; margin: 36px 0;"></div>

          <p style="color: #94a3b8; font-size: 12px; line-height: 1.8; margin: 0;">
            If you didn't sign up for Perplexity, you can safely ignore this email.
          </p>
          <p style="color: #cbd5e1; font-size: 11px; margin: 12px 0 0;">
            If the button doesn't work, copy and paste this link:<br/>
            <a href="${verifyUrl}" style="color: #31b8c6; word-break: break-all;">${verifyUrl}</a>
          </p>
        </div>

        <!-- footer -->
        <div style="padding: 20px 40px; background: #f8fafc; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 11px; margin: 0;">
            © 2026 Perplexity · You're receiving this because you signed up at perplexity.app
          </p>
        </div>

      </div>
    </div>
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

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

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

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

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

  // check token first before using it
  if (!token) {
    res.status(400);
    throw new Error("Verification token is missing");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await userModel.findOne({ email: decoded.email });

  if (!user) {
    res.status(400);
    throw new Error("Invalid token, user not found");
  }

  if (user.verified) {
    res.status(400);
    throw new Error("Email is already verified");
  }

  user.verified = true;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
