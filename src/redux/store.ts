import { configureStore } from "@reduxjs/toolkit";
import baseAPI from "./api/api";
import globalSearchReducer from "./features/search/globalSearchSlice";

export const store = configureStore({
  reducer: {
    [baseAPI.reducerPath]: baseAPI.reducer,
    globalSearch: globalSearchReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
