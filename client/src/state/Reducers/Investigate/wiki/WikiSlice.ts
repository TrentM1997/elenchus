import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/state/store";
import { getWikiExtract } from "./thunks";
import { AsyncState } from "@/state/types";
import { WikiResponseSchemaType } from "@elenchus/contracts/schemas/integrations/WikipediaExtractSchemas";
import { WikipediaToolState } from "./types";

export type WikipediaExtractState = AsyncState<WikiResponseSchemaType>;

interface WikiTypes {
  extractTool: WikipediaToolState;
  extract: WikipediaExtractState;
  currentRequestId: string | null;
}

const initialState: WikiTypes = {
  extractTool: { status: "closed" },
  extract: { status: "initial" },
  currentRequestId: null,
};

export const selectWikiExtract = (s: RootState) => s.investigation.wiki.extract;

export const selectWikiSummary = createSelector(
  selectWikiExtract,
  (extract) => {
    if (extract.status !== "ready") return null;

    if (extract.data.kind === "summary") {
      return extract.data;
    } else {
      return null;
    }
  },
);

export const selectWikiDisambig = createSelector(
  selectWikiExtract,
  (extract) => {
    if (extract.status !== "ready") return null;

    if (extract.data.kind === "disambiguation") {
      return extract.data;
    } else {
      return null;
    }
  },
);

export const WikipediaExtractSlice = createSlice({
  name: "investigate/wikiExtract",
  initialState: initialState,
  reducers: {
    wikiToolAction: (
      state: WikiTypes,
      action: PayloadAction<WikipediaToolState>,
    ) => {
      state.extractTool = action.payload;
    },

    clearWikiSlice: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getWikiExtract.pending, (state, action) => {
      state.currentRequestId = action.meta.requestId;
      state.extract = { status: "pending" };
    });
    builder.addCase(getWikiExtract.fulfilled, (state, action) => {
      if (state.currentRequestId !== action.meta.requestId) return;
      const payload = action.payload;

      if (payload.kind === "error") {
        state.extract = { status: "failed", details: payload.message };
      } else {
        state.extract = { status: "ready", data: payload };
      }
    });
    builder.addCase(getWikiExtract.rejected, (state, action) => {
      if (state.currentRequestId !== action.meta.requestId) return;
      const message =
        typeof action.payload === "string"
          ? action.payload
          : (action.error.message ?? "Failed to extract Wikipedia term");
      state.extract = { status: "failed", details: message };
    });
  },
});

export type WikiSliceState = ReturnType<typeof WikipediaExtractSlice.reducer>;

export const { clearWikiSlice, wikiToolAction } = WikipediaExtractSlice.actions;

export default WikipediaExtractSlice.reducer;
