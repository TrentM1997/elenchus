import type { RootState } from "@/state/store";

export const selectPOV = (state: RootState) => state.investigation.pov.pov;

export const selectPOVData = (state: RootState) => selectPOV(state).data;
