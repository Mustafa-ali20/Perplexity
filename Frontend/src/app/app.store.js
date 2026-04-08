import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // chat: (state = {}, action) => state, // Placeholder for chat reducer
  },
});
