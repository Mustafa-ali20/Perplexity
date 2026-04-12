import {
  setChats,
  setCurrentChatId,
  setError,
  setLoading,
  createNewChat,
  addNewMessage,
  addMessages,
} from "../chat.slice";
import {
  sendMessage,
  getChats,
  getMessages,
  deleteChat,
} from "../service/chat.api";
import { initializeSocketConnection } from "../service/chat.socket";
import { useDispatch } from "react-redux";

export const useChat = () => {
  const handleInitializeSocket = () => {
    initializeSocketConnection();
  };

  const dispatch = useDispatch();

async function handleSendMessage({ message, chatId }) {
  dispatch(setLoading(true));

  if (chatId) {
    dispatch(addNewMessage({ chatId, content: message, role: "user" }));
  }

  try {
    const data = await sendMessage(message, chatId);
    const { chat, aiMessage } = data;

    const resolvedChatId = chatId || chat?._id || "guest";

    if (!chatId) {
      // ✅ handle both logged in and guest
      dispatch(createNewChat({
        chatId: resolvedChatId,
        title: chat?.title || "Guest Chat",
      }));
      dispatch(addNewMessage({ chatId: resolvedChatId, content: message, role: "user" }));
    }

    dispatch(addNewMessage({
      chatId: resolvedChatId,
      content: aiMessage.content,
      role: aiMessage.role,
    }));

    dispatch(setCurrentChatId(resolvedChatId));
  } catch (_error) {
    dispatch(setError("Failed to send message"));
  } finally {
    dispatch(setLoading(false));
  }
}
  async function handleGetChats() {
    try {
      dispatch(setLoading(true));
      const data = await getChats();
      const { chats } = data;
      dispatch(
        setChats(
          chats.reduce((acc, chat) => {
            acc[chat._id] = {
              id: chat._id,
              title: chat.title,
              messages: [],
              lastUpdated: chat.updatedAt,
            };
            return acc;
          }, {}),
        ),
      );
    } catch {
      // guest user, just ignore
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleOpenChat(chatId, chats) {
    if (chats[chatId].messages.length === 0) {
      const data = await getMessages(chatId);

      const { messages } = data;

      const formattedMessages = messages.map((msg) => ({
        content: msg.content,
        role: msg.role,
      }));
      dispatch(addMessages({ chatId, messages: formattedMessages }));
    }
    dispatch(setCurrentChatId(chatId));
  }

  return {
    handleInitializeSocket,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
  };
};
