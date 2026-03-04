import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCategory: "",
};

const postSlice = createSlice({
  name: "postCategory",
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
});

export const { setSelectedCategory } = postSlice.actions;
export default postSlice.reducer;
