import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type PaginationStatus = "active" | "idle";

type StepProgress = "initial" | "proceed" | "halt";

export type WizardStep = { num: number; status: StepProgress };

export interface StepState {
  wizardStep: WizardStep;
  status: PaginationStatus;
  acceptInput: boolean | null;
}

const initialState: StepState = {
  wizardStep: { num: 0, status: "initial" },
  status: "idle",
  acceptInput: null,
};

export const StepSlice = createSlice({
  name: "StepsCounter",
  initialState: initialState,
  reducers: {
    increment: (state) => {
      const next = state.wizardStep.num + 1;
      state.wizardStep = { num: next, status: "initial" };
    },
    decrement: (state) => {
      const prev = state.wizardStep.num - 1;
      state.wizardStep = { num: prev, status: "proceed" };
    },
    denyIncrement: (state) => {
      state.wizardStep.status = "halt";
    },
    allowIncrement: (state) => {
      state.wizardStep.status = "proceed";
    },
    goToStep: (state, action: PayloadAction<number>) => {
      state.wizardStep = { status: "proceed", num: action.payload };
    },
    backToStart: (state) => {
      state.wizardStep = { num: 0, status: "initial" };
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
} = StepSlice.actions;

export default StepSlice.reducer;
