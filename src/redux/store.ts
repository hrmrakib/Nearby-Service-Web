import { configureStore } from "@reduxjs/toolkit";
import baseAPI from "./api/api";
import globalSearchReducer from "./features/search/globalSearchSlice";
import authReducer from "./features/auth/authSlice";
import chatReducer from "./features/chat/chatSlice";
import postModalReducer from "./features/postModal/postModalSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    [baseAPI.reducerPath]: baseAPI.reducer,
    globalSearch: globalSearchReducer,
    postModal: postModalReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
