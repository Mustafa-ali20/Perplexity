import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chat: {},
    currentChatId: localStorage.getItem("currentChatId") || null,
    isLoading: false,
    error: null,
  },
  reducers: {
    createNewChat: (state, action) => {
      const { chatId, title } = action.payload;
      state.chat[chatId] = {
        id: chatId,
        title,
        messages: [],
        lastUpdated: new Date().toISOString(),
      };
    },
    addNewMessage: (state, action) => {
      const { chatId, content, role } = action.payload;
      state.chat[chatId].messages.push({ content, role });
    },
    addMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      state.chat[chatId].messages.push(...messages);
    },
    setChats: (state, action) => {
      state.chat = action.payload;
    },
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setChats,
  setCurrentChatId,
  setLoading,
  setError,
  createNewChat,
  addNewMessage,
  addMessages,
} = chatSlice.actions;
export default chatSlice.reducer;
