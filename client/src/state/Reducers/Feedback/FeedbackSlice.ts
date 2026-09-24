import { FeedbackResponseSchemaType } from "@elenchus/contracts/schemas/auth/FeedbackSchema";
import { AsyncState } from "@/state/types";
import { createSlice } from "@reduxjs/toolkit";

export type FeedbackState = AsyncState<FeedbackResponseSchemaType>;

interface FeedbackTypes {
  status: string;
  authorEmail: string;
  message: string;
  seen: boolean | null;
  declined: boolean | null;
  feedback: FeedbackState;
}

const initialState: FeedbackTypes = {
  status: "idle",
  authorEmail: "",
  message: "",
  seen: false,
  declined: false,
  feedback: { status: "initial" },
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
