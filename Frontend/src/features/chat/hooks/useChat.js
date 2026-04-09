import { initializeSocketConnection } from "../service/chat.socket";

export const useChat = () => {
  const handleInitializeSocket = () => {
    initializeSocketConnection();
  };

  return {
    handleInitializeSocket,
  };
};
