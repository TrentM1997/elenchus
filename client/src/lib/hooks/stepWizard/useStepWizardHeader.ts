import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { StepHeader } from "@/components/React/features/investigate/phase1/components/steps/StepHeader";

export const useStepWizardHeader = ({
  title,
  subheader,
}: Pick<StepHeader, "title" | "subheader">) => {
  const step = useSelector(
    (state: RootState) => state.investigation.stepper.wizardStep.current,
  );
  const [display, setDisplay] = useState({
    title: title,
    subheader: subheader,
  });
  const [propsChanging, setPropsChanging] = useState<boolean>(false);

  useEffect(() => {
    setPropsChanging(true);

    const timer = setTimeout(() => {
      setDisplay({
        title: title,
        subheader: subheader,
      });
      setPropsChanging(false);
    }, 20);

    return () => clearTimeout(timer);
  }, [step, title, subheader]);

  return {
    display,
    propsChanging,
  };
};
