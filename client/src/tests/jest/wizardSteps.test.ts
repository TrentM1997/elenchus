import { helpInfo } from "../../components/React/global/Help/tokens/helptokens";
import reducer, { increment, decrement, denyIncrement } from "../../state/Reducers/Investigate/pov/StepSlice";
import { selectWizardStep, selectWizardStepIndex } from "../../state/Reducers/Investigate/pov/selectors";
import type { RootState } from "../../state/store";

const expectedHeaders = {
  idea: { title: "Tackle an idea", subheader: "from the top down" },
  approach: { title: "Your angle of approach" },
  biases: { title: "Acknowledge biases" },
  premises: { title: "Underlying premises? (optional)" },
  final: { title: "Search for evidence" },
};

test("next visits each named step in workflow order and stops at final", () => {
  let state = reducer(undefined, { type: "init" });
  expect(state.wizardStep).toEqual({ current: "idea", status: "initial", head: expectedHeaders.idea, help: helpInfo.idea });
  for (const current of ["approach", "biases", "premises", "final"] as const) {
    state = reducer(state, increment());
    expect(state.wizardStep).toEqual({ current, status: "initial", head: expectedHeaders[current], help: helpInfo[current] });
  }
  expect(reducer(state, increment())).toEqual(state);
});

test("back retraces the workflow and stops at idea", () => {
  let state = reducer(undefined, { type: "init" });
  for (let i = 0; i < 4; i++) state = reducer(state, increment());
  for (const current of ["premises", "biases", "approach", "idea"] as const) {
    state = reducer(state, decrement());
    expect(state.wizardStep).toEqual({ current, status: "proceed", head: expectedHeaders[current], help: helpInfo[current] });
  }
  expect(reducer(state, decrement())).toEqual(state);
});

test("denying progression marks the current step without changing it", () => {
  let state = reducer(undefined, { type: "init" });
  for (let i = 0; i < 3; i++) state = reducer(state, increment());
  state = reducer(state, denyIncrement());
  expect(state.wizardStep).toEqual({ current: "premises", status: "halt", head: expectedHeaders.premises, help: helpInfo.premises });
});

test("presentation derives an ordinal without storing a numeric identity", () => {
  const stepper = reducer(reducer(undefined, increment()), increment());
  const state = { investigation: { stepper } } as RootState;
  expect(selectWizardStep(state)).toBe("biases");
  expect(selectWizardStepIndex(state)).toBe(2);
  expect(stepper.wizardStep).not.toHaveProperty("num");
});
