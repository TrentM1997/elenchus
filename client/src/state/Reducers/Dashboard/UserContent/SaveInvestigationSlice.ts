import { serverClient } from "@/lib/services/client/serverClient";
import type { PersistInvestigationInputSchemaType } from "@/lib/schemas/investigations/InvestigationSchema";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface SaveInvestigation {
  status: string;
  saved: boolean;
  sources: string[] | null;
  swapButtons: boolean | null;
}

const initialState: SaveInvestigation = {
  status: "idle",
  saved: false,
  sources: null,
  swapButtons: false,
};

export const saveUserInvestigation = createAsyncThunk(
  "user/SaveInvestigation",
  async (investigation: PersistInvestigationInputSchemaType, { rejectWithValue }) => {
    try {
      const result = await serverClient.privileged.user.write.investigation(investigation);
      if (result.ok === false) return rejectWithValue(result.message);
      return result.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Failed to save investigation");
    }
  },
);

const SaveInvestigationSlice = createSlice({
  name: "saveInvestigation",
  initialState: initialState,
  reducers: {
    removeNotification: (state, action) => {
      state.status = action.payload;
    },
    recordSources: (state, action) => {
      state.sources = action.payload;
    },
    switchButtons: (state, action) => {
      state.swapButtons = action.payload;
    },
    researchSaved: (state, action) => {
      state.saved = action.payload;
    },
    clearSaveInvestigationSlice: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveUserInvestigation.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(saveUserInvestigation.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.saved = true;
      })
      .addCase(saveUserInvestigation.rejected, (state, action) => {
        state.status = "rejected";
        state.saved = false;
      });
  },
});

export const {
  removeNotification,
  clearSaveInvestigationSlice,
  recordSources,
  switchButtons,
  researchSaved,
} = SaveInvestigationSlice.actions;

export default SaveInvestigationSlice.reducer;

