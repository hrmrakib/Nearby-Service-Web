import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatId: null,
  selectedUser: null,
  newChatStart: false,
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

    setNewChatStart: (state, action) => {
      state.newChatStart = action.payload;
    },
  },
});

export const { setChatId, setSelectedUser, setNewChatStart } =
  chatSlice.actions;
export default chatSlice.reducer;
