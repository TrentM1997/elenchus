import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/state/store";
import { getWikiExtract } from "./thunks";
import { AsyncState } from "@/state/types";
import { WikiResponseSchemaType } from "@elenchus/contracts/schemas/integrations/WikipediaExtractSchemas";

interface modalXY {
  x: number;
  y: number;
}

export type WikipediaExtractState = AsyncState<WikiResponseSchemaType>;

export interface ModalStages {
  display: boolean;
  highlight: boolean;
  confirmExtract: boolean;
  text: string | null;
}

interface WikiTypes {
  wikiModalStages: ModalStages;
  displayWikiModal: boolean;
  gettingSelection: boolean;
  status: string;
  extract: WikipediaExtractState;
  modalPosition: modalXY | null;
  selectedText: string | null;
  errormessage: string | null;
}

const initialState: WikiTypes = {
  wikiModalStages: {
    display: false,
    highlight: false,
    confirmExtract: false,
    text: null,
  },
  displayWikiModal: false,
  gettingSelection: false,
  status: "idle",
  extract: { status: "initial" },
  modalPosition: null,
  selectedText: null,
  errormessage: null,
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
    selectingText: (state, action) => {
      state.gettingSelection = action.payload;
    },
    getModalPosition: (
      state,
      action: PayloadAction<{ x: number; y: number }>,
    ) => {
      state.modalPosition = action.payload;
    },
    getSelectedText: (state, action) => {
      state.selectedText = action.payload;
    },
    showWikiModal: (state) => {
      state.displayWikiModal = !state.displayWikiModal;
    },
    modalStages: (state, action: PayloadAction<ModalStages>) => {
      state.wikiModalStages = action.payload;
    },

    clearWikiSlice: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getWikiExtract.pending, (state) => {
      state.status = "pending";
      state.extract = { status: "pending" };
      state.errormessage = null;
    });
    builder.addCase(
      getWikiExtract.fulfilled,
      (state, action: PayloadAction<WikiResponseSchemaType>) => {
        const payload = action.payload;

        if (payload.kind === "error") {
          state.status = "rejected";
          state.errormessage = payload.message;
          state.extract = { status: "failed", details: payload.message };
        } else {
          state.status = "fulfilled";
          state.errormessage = null;
          state.extract = { status: "ready", data: payload };
        }
      },
    );
    builder.addCase(getWikiExtract.rejected, (state, action) => {
      const message = typeof action.payload === "string"
        ? action.payload
        : action.error.message ?? "Failed to extract Wikipedia term";
      state.status = "rejected";
      state.errormessage = message;
      state.extract = { status: "failed", details: message };
    });
  },
});

export type WikiSliceState = ReturnType<typeof WikipediaExtractSlice.reducer>;

export const {
  selectingText,
  getModalPosition,
  clearWikiSlice,
  getSelectedText,
  showWikiModal,
  modalStages,
} = WikipediaExtractSlice.actions;

export default WikipediaExtractSlice.reducer;
