import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import asyncHandler from "express-async-handler";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const { message, chat: chatId } = req.body;
  if (!message) return res.status(400).json({ message: "Message is required" });

  let title = null, chat = null;

  if (!chatId) {
    title = await generateChatTitle(message);
    // only create chat in DB if user is logged in
    if (req.user) {
      chat = await chatModel.create({ user: req.user, title });
    }
  }

  if (req.user) {
    await messageModel.create({
      chat: chatId || chat._id,
      content: message,
      role: "user",
    });
  }

  const messages = req.user
    ? await messageModel.find({ chat: chatId || chat._id })
    : [{ role: "user", content: message }]; // guest: just send current message

  const result = await generateResponse(messages);

  if (req.user) {
    const aiMessage = await messageModel.create({
      chat: chatId || chat._id,
      content: result,
      role: "ai",
    });
    return res.status(201).json({ title, chat, aiMessage });
  }

  // guest response — no DB saving
  res.status(200).json({
    title,
    chat: null,
    aiMessage: { content: result, role: "ai" },
  });
});

export const getChats = asyncHandler(async (req, res) => {
  const chats = await chatModel
    .find({ user: req.user.id })
    .sort({ createdAt: -1 });
  res.status(200).json({ message: "Chats retrieved successfully", chats });
});

export const getMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const chat = await chatModel.findOne({ _id: chatId, user: req.user.id });

  if (!chat) return res.status(404).json({ message: "Chat not found" });

  const messages = await messageModel
    .find({ chat: chatId })
    .sort({ createdAt: 1 });
  res
    .status(200)
    .json({ message: "Messages retrieved successfully", messages });
});

export const deleteChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const chat = await chatModel.findOneAndDelete({
    _id: chatId,
    user: req.user.id,
  });
  await messageModel.deleteMany({ chat: chatId });

  if (!chat) return res.status(404).json({ message: "Chat not found" });

  res.status(200).json({ message: "Chat deleted successfully" });
});
