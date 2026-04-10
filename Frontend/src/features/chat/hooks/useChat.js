import { initializeSocketConnection } from "../service/chat.socket";
import {
  sendMessage,
  getChats,
  getMessages,
  deleteChat,
} from "../service/chat.api";
import { useDispatch } from "react-redux";

export const useChat = () => {
  const handleInitializeSocket = () => {
    initializeSocketConnection();
  };

  const dispatch = useDispatch();

  function sendMessage({ message, chatId }) {
    return sendMessage(message, chatId);
  }

  function getChats() {
    return getChats();
  }

  function getMessages({ chatId }) {
    return getMessages(chatId);
  }

  function deleteChat({ chatId }) {
    return deleteChat(chatId);
  }

  return {
    handleInitializeSocket,
    sendMessage,
    getChats,
    getMessages,
    deleteChat,
  };
};
