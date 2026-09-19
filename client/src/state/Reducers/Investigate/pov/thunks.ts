import type { AppDispatch, RootState } from "@/state/store";
import { updatePOV } from "./UserPOV";
import { selectPOVData } from "./selectors";
import type { PerspectiveDraft } from "./types";

export const updatePOVDraft = (changes: Partial<PerspectiveDraft>) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(updatePOV({
      status: "draft",
      data: { ...selectPOVData(getState()), ...changes },
    }));
  };

export const establishPOV = () =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(updatePOV({
      status: "established",
      data: selectPOVData(getState()),
    }));
  };
