/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type PostType = "deal" | "event" | "service" | "alert" | null;

interface PostModalState {
  isOpen: boolean;
  selectedPostType: PostType;
  data: any;
  isEditMode?: boolean;
}

const initialState: PostModalState = {
  isOpen: false,
  selectedPostType: null,
  data: null,
  isEditMode: false,
};

const postModalSlice = createSlice({
  name: "postModal",
  initialState,
  reducers: {
    openPostModal: (state) => {
      state.isOpen = true;
      state.selectedPostType = null;
      state.data = null;
      state.isEditMode = false;
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
    setIsEditMode: (state, action: PayloadAction<boolean>) => {
      state.isEditMode = action.payload;
    },
  },
});

export const {
  openPostModal,
  closePostModal,
  selectPostType,
  goBack,
  setDataForPostUpdate,
  setIsEditMode,
} = postModalSlice.actions;
export default postModalSlice.reducer;
