import { Router } from "express";
import {
  sendMessage,
  getChats,
  getMessages,
  deleteChat,
} from "../controllers/chat.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import optionalAuth from "../middlewares/optionalAuth.middleware.js";
import rateLimit from "express-rate-limit";

const chatRouter = Router();

const guestLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 messages per minute for guests
  skip: (req) => !!req.user, // ✅ skip limit for logged in users
  message: {
    message: "Too many requests, please register for unlimited access",
  },
});

chatRouter.post("/message", optionalAuth, guestLimiter, sendMessage);
chatRouter.get("/", authMiddleware, getChats);
chatRouter.get("/:chatId/messages", authMiddleware, getMessages);
chatRouter.delete("/delete/:chatId", authMiddleware, deleteChat);

export default chatRouter;
