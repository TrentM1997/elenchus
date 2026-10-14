import { helpInfo } from "@/components/React/global/Help/tokens/helptokens";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { stepOrder, type WizardStep, type WizardStepType } from "./types";
import { assertNever } from "@/lib/helpers/asserts/assertNever";

export type PaginationStatus = "active" | "idle";

export type WizardStepHelpStatus = "open" | "closed";

export interface StepState {
  wizardStep: WizardStepType;
  status: PaginationStatus;
  helpModal: WizardStepHelpStatus;
}

function createWizardStep(
  current: WizardStep,
  status: WizardStepType["status"],
): WizardStepType {
  switch (current) {
    case "idea":
      return {
        current,
        head: { title: "Tackle an idea", subheader: "from the top down" },
        status,
        help: helpInfo.idea,
      };
    case "approach":
      return {
        current,
        head: { title: "Your angle of approach" },
        status,
        help: helpInfo.approach,
      };
    case "biases":
      return {
        current,
        head: { title: "Acknowledge biases" },
        status,
        help: helpInfo.biases,
      };
    case "premises":
      return {
        current,
        head: { title: "Underlying premises? (optional)" },
        status,
        help: helpInfo.premises,
      };
    case "final":
      return {
        current,
        head: { title: "Search for evidence" },
        status,
        help: helpInfo.final,
      };

    default: {
      return assertNever(current);
    }
  }
}

const initialState: StepState = {
  wizardStep: createWizardStep("idea", "initial"),
  status: "idle",
  helpModal: "closed",
};

export const StepSlice = createSlice({
  name: "StepsCounter",
  initialState: initialState,
  reducers: {
    updatePaginateStatus: (state, action: PayloadAction<PaginationStatus>) => {
      state.status = action.payload;
    },
    getHelpModalStatus: (
      state: StepState,
      action: PayloadAction<WizardStepHelpStatus>,
    ) => {
      state.helpModal = action.payload;
    },
    increment: (state) => {
      const index = stepOrder.indexOf(state.wizardStep.current);
      const next = stepOrder[index + 1];
      if (next) state.wizardStep = createWizardStep(next, "initial");
    },
    decrement: (state) => {
      const index = stepOrder.indexOf(state.wizardStep.current);
      const previous = stepOrder[index - 1];
      if (previous) state.wizardStep = createWizardStep(previous, "proceed");
    },
    denyIncrement: (state) => {
      state.wizardStep.status = "halt";
    },
  },
});

export const {
  increment,
  decrement,
  denyIncrement,
  updatePaginateStatus,
  getHelpModalStatus,
} = StepSlice.actions;

export default StepSlice.reducer;
