import { selectPOVData } from "@/state/Reducers/Investigate/pov/selectors";
import type { RootState } from "@/state/store";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  increment,
  denyIncrement,
} from "@/state/Reducers/Investigate/pov/StepSlice";
import { selectPost } from "@/state/Reducers/BlueSky/BlueSkySlice";
import { useMemo } from "react";

export const useNextStep = () => {
  const {
    wizardStep: { current: step },
    status,
  } = useSelector(
    (state: RootState) => state.investigation.stepper,
    shallowEqual,
  );
  const idea = useSelector((state: RootState) => selectPOVData(state).idea);
  const gettingHelp = useSelector(
    (state: RootState) => state.investigation.help.gettingHelp,
  );
  const dispatch = useDispatch();
  const noInput = useMemo(() => {
    const noAction: boolean = idea === null;
    const empty: boolean = idea === "";
    return noAction || empty;
  }, [idea]);

  const handleStep = () => {
    if (step === "final" || gettingHelp) return;
    window.dispatchEvent(new CustomEvent("nextStepClick"));
    if (status === "active" && idea !== "") {
      dispatch(increment());
      dispatch(selectPost({ status: "initial" }));
    } else if (noInput) {
      dispatch(denyIncrement());
    }
  };

  return {
    handleStep,
    step,
    gettingHelp,
  };
};
