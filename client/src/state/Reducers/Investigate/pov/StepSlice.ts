import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { stepOrder, type WizardStep, type WizardStepType } from "./types";

export type PaginationStatus = "active" | "idle";

export interface StepState {
  wizardStep: WizardStepType;
  status: PaginationStatus | null;
  acceptInput: boolean | null;
}

const initialState: StepState = {
  wizardStep: { current: "idea", status: "initial" },
  status: "idle",
  acceptInput: null,
};

export const StepSlice = createSlice({
  name: "StepsCounter",
  initialState: initialState,
  reducers: {
    updatePaginateStatus: (
      state,
      action: PayloadAction<PaginationStatus | null>,
    ) => {
      state.status = action.payload;
    },
    increment: (state) => {
      const index = stepOrder.indexOf(state.wizardStep.current);
      const next = stepOrder[index + 1];
      if (next) state.wizardStep = { current: next, status: "initial" };
    },
    decrement: (state) => {
      const index = stepOrder.indexOf(state.wizardStep.current);
      const previous = stepOrder[index - 1];
      if (previous) state.wizardStep = { current: previous, status: "proceed" };
    },
    denyIncrement: (state) => {
      state.wizardStep.status = "halt";
    },
    allowIncrement: (state) => {
      state.wizardStep.status = "proceed";
    },
    goToStep: (state, action: PayloadAction<WizardStep>) => {
      state.wizardStep = { status: "proceed", current: action.payload };
    },
    backToStart: (state) => {
      state.wizardStep = { current: "idea", status: "initial" };
    },
  },
});

export const {
  increment,
  decrement,
  goToStep,
  backToStart,
  denyIncrement,
  allowIncrement,
  updatePaginateStatus,
} = StepSlice.actions;

export default StepSlice.reducer;
