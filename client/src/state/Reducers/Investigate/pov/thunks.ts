import type { AppDispatch, RootState } from "@/state/store";
import { startFraming, startSearching, updateFraming } from "../research/ResearchSlice";
import { selectPOVData } from "./selectors";
import type { PerspectiveDraft } from "./types";
import { clearSaveInvestigationSlice } from "../../Dashboard/UserContent/SaveInvestigationSlice";

export const updatePOVDraft = (changes: Partial<PerspectiveDraft>) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    if (state.investigation.research.research.phase === "initial") {
      dispatch(clearSaveInvestigationSlice());
    }
    const { perspective, ...fields } = { ...selectPOVData(state), ...changes };
    const framing = { ...fields, initial_perspective: perspective };
    dispatch(state.investigation.research.research.phase === "initial"
      ? startFraming(framing)
      : updateFraming(framing));
  };

export const establishPOV = () =>
  (dispatch: AppDispatch) => {
    dispatch(startSearching());
  };
