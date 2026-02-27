import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatId: null,
  selectedUser: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatId: (state, action) => {
      state.chatId = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
});

export const { setChatId, setSelectedUser } = chatSlice.actions;
export default chatSlice.reducer;
