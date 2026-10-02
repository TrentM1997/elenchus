import reducer, { increment, decrement, denyIncrement } from "../../state/Reducers/Investigate/pov/StepSlice";
import { selectWizardStep, selectWizardStepIndex } from "../../state/Reducers/Investigate/pov/selectors";
import type { RootState } from "../../state/store";

test("next visits each named step in workflow order and stops at final", () => {
  let state = reducer(undefined, { type: "init" });
  expect(state.wizardStep).toEqual({ current: "idea", status: "initial" });
  for (const current of ["approach", "biases", "premises", "final"]) {
    state = reducer(state, increment());
    expect(state.wizardStep).toEqual({ current, status: "initial" });
  }
  expect(reducer(state, increment())).toEqual(state);
});

test("back retraces the workflow and stops at idea", () => {
  let state = reducer(undefined, { type: "init" });
  for (let i = 0; i < 4; i++) state = reducer(state, increment());
  for (const current of ["premises", "biases", "approach", "idea"]) {
    state = reducer(state, decrement());
    expect(state.wizardStep).toEqual({ current, status: "proceed" });
  }
  expect(reducer(state, decrement())).toEqual(state);
});

test("denying progression marks the current step without changing it", () => {
  let state = reducer(undefined, { type: "init" });
  for (let i = 0; i < 3; i++) state = reducer(state, increment());
  state = reducer(state, denyIncrement());
  expect(state.wizardStep).toEqual({ current: "premises", status: "halt" });
});

test("presentation derives an ordinal without storing a numeric identity", () => {
  const stepper = reducer(reducer(undefined, increment()), increment());
  const state = { investigation: { stepper } } as RootState;
  expect(selectWizardStep(state)).toBe("biases");
  expect(selectWizardStepIndex(state)).toBe(2);
  expect(stepper.wizardStep).not.toHaveProperty("num");
});
