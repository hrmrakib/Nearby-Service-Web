/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type PostType = "deal" | "event" | "service" | "alert" | null;

interface PostModalState {
  isOpen: boolean;
  selectedPostType: PostType;
  data: any;
}

const initialState: PostModalState = {
  isOpen: false,
  selectedPostType: null,
  data: null,
};

const postModalSlice = createSlice({
  name: "postModal",
  initialState,
  reducers: {
    openPostModal: (state) => {
      state.isOpen = true;
      state.selectedPostType = null;
    },
    closePostModal: (state) => {
      state.isOpen = false;
      state.selectedPostType = null;
    },
    selectPostType: (state, action: PayloadAction<PostType>) => {
      state.selectedPostType = action.payload;
    },
    goBack: (state) => {
      state.selectedPostType = null;
    },
    setDataForPostUpdate: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
  },
});

export const { openPostModal, closePostModal, selectPostType, goBack, setDataForPostUpdate } =
  postModalSlice.actions;
export default postModalSlice.reducer;
