import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

const optionalAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return next(); // guest, just continue

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select("-password");
    if (user) req.user = user;
  } catch {
    // invalid token, treat as guest
  }
  next();
};

export default optionalAuth;