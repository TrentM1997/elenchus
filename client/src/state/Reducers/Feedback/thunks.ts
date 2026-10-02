import { serverClient } from "@/lib/services/client/serverClient";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const submitFeedback = createAsyncThunk(
  "FeedbackSlice/submitFeedback",
  async ({ email, message }: { email: string; message: string }, thunkAPI) => {
    try {
      const result = await serverClient.general.user.submitFeedback({
        email,
        message,
      });

      if (result.ok === false) {
        throw new Error(result.message);
      }

      return result;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err instanceof Error ? err.message : "Feedback submission failed",
      );
    }
  },
);
