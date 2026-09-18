import { createSlice } from "@reduxjs/toolkit";

interface FeedbackTypes {
  status: string;
  authorEmail: string;
  message: string;
  seen: boolean | null;
  declined: boolean | null;
}

const initialState: FeedbackTypes = {
  status: "idle",
  authorEmail: "",
  message: "",
  seen: false,
  declined: false,
};

export const FeedBackSlice = createSlice({
  name: "feedback",
  initialState: initialState,
  reducers: {
    getAuthorEmail: (state, action) => {
      state.authorEmail = action.payload;
    },
    getFeedBackMessage: (state, action) => {
      state.message = action.payload;
    },
    feedbackSubmitted: (state) => {
      state.status = "fullfilled";
    },
    stopAskingForFeedBack: (state, action) => {
      state.seen = action.payload;
    },
    declineFeedBack: (state, action) => {
      state.declined = action.payload;
    },
  },
});

export const {
  getAuthorEmail,
  getFeedBackMessage,
  feedbackSubmitted,
  stopAskingForFeedBack,
  declineFeedBack,
} = FeedBackSlice.actions;

export default FeedBackSlice.reducer;
