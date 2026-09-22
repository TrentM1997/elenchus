import type { RootState } from "@/state/store";
import { createSelector } from "@reduxjs/toolkit";
import type { PerspectiveDraft } from "./types";

const emptyFraming: PerspectiveDraft = {
  idea: "",
  perspective: null,
  expertise: null,
  biases: "",
  premises: "",
};

// Keep the existing form field names while research owns the draft.
export const selectPOVData = createSelector(
  [(state: RootState) => state.investigation.research.research],
  (research): PerspectiveDraft => {
    if (research.phase === "initial") return emptyFraming;
    const framing = research.data.framing;
    return {
      idea: framing.idea,
      perspective: framing.initial_perspective,
      expertise: framing.expertise,
      biases: framing.biases ?? "",
      premises: framing.premises ?? "",
    };
  },
);
