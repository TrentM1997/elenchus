import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  PerspectiveFraming,
  ResearchReflection,
  SaveInvestigationState,
  SourcesAndExtracts,
  UserResearchType,
} from "./types";

export interface ResearchState {
  research: UserResearchType;
  persistence: SaveInvestigationState;
}

const initialState: ResearchState = {
  research: { phase: "initial" },
  persistence: { status: "initial" },
};

const ResearchSlice = createSlice({
  name: "ResearchSlice",
  initialState: initialState,
  reducers: {
    updateResearchPersistence: (
      state: ResearchState,
      action: PayloadAction<SaveInvestigationState>,
    ) => {
      state.persistence = action.payload;
    },
    startFraming: (
      state: ResearchState,
      action: PayloadAction<PerspectiveFraming>,
    ) => {
      if (state.research.phase !== "initial") return;

      state.research = {
        phase: "framing",
        data: { framing: action.payload },
      };
    },

    startSearching: (state: ResearchState) => {
      const research = state.research;
      if (research.phase !== "framing" && research.phase !== "evidence") return;
      if (!research.data.framing.idea.trim()) return;

      state.research = {
        phase: "searching",
        data: {
          framing: research.data.framing,
        },
      };
    },

    startEvidence: (
      state: ResearchState,
      action: PayloadAction<SourcesAndExtracts>,
    ) => {
      const research = state.research;
      if (research.phase !== "searching") return;

      state.research = {
        phase: "evidence",
        data: {
          ...research.data,
          context: action.payload,
        },
      };
    },
    startReflection: (
      state: ResearchState,
      action: PayloadAction<ResearchReflection>,
    ) => {
      const research = state.research;
      if (research.phase !== "evidence") return;

      state.research = {
        phase: "reflection",
        data: { ...research.data, reflection: action.payload },
      };
    },
    completeResearch: (state: ResearchState) => {
      const research = state.research;
      if (research.phase !== "reflection") return;

      state.research = {
        phase: "completed",
        data: research.data,
      };
    },
    endInvestigation: (state: ResearchState) => {
      const research = state.research;
      if (research.phase !== "completed") return;

      state.research = {
        phase: "end",
        data: research.data,
      };
    },
    updateReflection: (
      state: ResearchState,
      action: PayloadAction<ResearchReflection>,
    ) => {
      const research = state.research;
      if (research.phase === "initial" || !("reflection" in research.data))
        return;

      research.data.reflection = action.payload;
    },
    updateFraming: (
      state: ResearchState,
      action: PayloadAction<PerspectiveFraming>,
    ) => {
      if (state.research.phase === "initial") return;

      state.research.data.framing = action.payload;
    },
    updateResearchSources: (
      state: ResearchState,
      action: PayloadAction<SourcesAndExtracts["sources"]>,
    ) => {
      const research = state.research;

      if (research.phase === "initial" || !("context" in research.data)) return;

      research.data.context.sources = action.payload;
    },
    updateResearchExtracts: (
      state: ResearchState,
      action: PayloadAction<SourcesAndExtracts["wikipedia_extracts"]>,
    ) => {
      const research = state.research;

      if (research.phase === "initial" || !("context" in research.data)) return;

      research.data.context.wikipedia_extracts = action.payload;
    },
  },
});

export const {
  updateResearchPersistence,
  startReflection,
  completeResearch,
  updateReflection,
  startEvidence,
  startFraming,
  startSearching,
  updateFraming,
  updateResearchExtracts,
  updateResearchSources,
  endInvestigation,
} = ResearchSlice.actions;

export default ResearchSlice.reducer;
