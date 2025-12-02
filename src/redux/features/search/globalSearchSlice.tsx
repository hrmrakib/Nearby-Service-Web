import { createSlice } from "@reduxjs/toolkit";

const globalSearchSlice = createSlice({
  name: "globalSearch",
  initialState: {
    searchValue: "",
  },
  reducers: {
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
  },
});

export const { setSearchValue } = globalSearchSlice.actions;
export default globalSearchSlice.reducer;
