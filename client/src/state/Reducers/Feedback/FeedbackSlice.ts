import { FeedbackResponseSchemaType } from "@elenchus/contracts/schemas/auth/FeedbackSchema";
import { AsyncState } from "@/state/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FeedbackFormState } from "./types";
import { submitFeedback } from "./thunks";

export type FeedbackState = AsyncState<FeedbackResponseSchemaType>;

interface FeedbackTypes {
  form: FeedbackFormState;
  seen: boolean | null;
  feedback: FeedbackState;
}

const initialState: FeedbackTypes = {
  form: { status: "initial" },
  seen: false,
  feedback: { status: "initial" },
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
    stopAskingForFeedBack: (state, action) => {
      state.seen = action.payload;
    },
    declineFeedBack: (state) => {
      state.form = { status: "initial" };
    },
  },
  extraReducers(builder) {
    builder.addCase(submitFeedback.pending, (state) => {
      state.feedback = { status: "pending" };
    });

    builder.addCase(submitFeedback.rejected, (state) => {
      state.feedback = {
        status: "failed",
        details: "Feedback submission failure",
      };
    });

    builder.addCase(submitFeedback.fulfilled, (state, action) => {
      state.feedback = { status: "ready", data: action.payload };
    });
  },
});

export const {
  stopAskingForFeedBack,
  declineFeedBack,
  showFeedbackForm,
  recordFeedback,
} = FeedBackSlice.actions;

export default FeedBackSlice.reducer;
