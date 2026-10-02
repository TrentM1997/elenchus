import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FeedbackFormState } from "./types";

interface FeedbackTypes {
  form: FeedbackFormState;
}

const initialState: FeedbackTypes = {
  form: { status: "initial" },
};

export const FeedBackSlice = createSlice({
  name: "feedback",
  initialState: initialState,
  reducers: {
    showFeedbackForm: (state: FeedbackTypes) => {
      state.form = { status: "showing" };
    },
    recordFeedback: (
      state: FeedbackTypes,
      action: PayloadAction<Extract<FeedbackFormState, { status: "ready" }>>,
    ) => {
      state.form = action.payload;
    },
    declineFeedBack: (state) => {
      state.form = { status: "initial" };
    },
  },
});

export const { declineFeedBack, showFeedbackForm, recordFeedback } =
  FeedBackSlice.actions;

export default FeedBackSlice.reducer;
