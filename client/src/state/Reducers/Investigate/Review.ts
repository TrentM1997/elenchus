import { WikiDisambigCandidate } from "@/lib/services/wiki/wiki";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type EndingPerspective =
  | { status: "draft"; data: Partial<FinishedState> }
  | { status: "finsihed"; data: FinishedState };

export interface Extracts {
  title: string;
  extract?: string;
  associatedArticle: string;
  candidates?: WikiDisambigCandidate[];
}

interface FinishedState {
  endingPerspective: string;
  newConcepts: boolean;
  newPOV: string | null;
  wantedMore: boolean | null;
  merit: boolean;
  movedOnIdea: boolean;
  takeAway: string | null;
  extracts: Extracts[];
}

interface InitialState {
  final: EndingPerspective;
}

const initialState: InitialState = {
  final: { status: "draft", data: {} },
};

type UpdateExtractPayload = {
  title: string;
  extract?: string;
  associatedArticle: string;
  candidates?: WikiDisambigCandidate[];
};

export const ReviewSlice = createSlice({
  name: "FinishLine",
  initialState: initialState,
  reducers: {
    updateFinalDraft: (
      state: InitialState,
      action: PayloadAction<EndingPerspective>,
    ) => {
      state.final = action.payload;
    },
    getExtract: (state, action: PayloadAction<UpdateExtractPayload>) => {
      if (state.final.status !== "finsihed") return;

      const data = action.payload;
      const extractData = data?.candidates
        ? {
            title: data.title,
            associatedArticle: data.associatedArticle,
            candidates: data.candidates,
          }
        : {
            title: data.title,
            associatedArticle: data.associatedArticle,
            extract: data.extract,
          };
      const exists = state.final.data.extracts.some(
        (obj: Extracts) => obj.title === extractData.title,
      );

      if (exists) {
        state.final.data.extracts = state.final.data.extracts.filter(
          (obj) => obj.title !== extractData.title,
        );
      } else {
        state.final.data.extracts.push(extractData);
      }
    },
  },
});

export const { updateFinalDraft, getExtract } = ReviewSlice.actions;

export default ReviewSlice.reducer;
