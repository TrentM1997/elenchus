import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import { RootState } from "@/state/store";
import { WizardStepType } from "@/state/Reducers/Investigate/pov/types";

export default function Stepper(): JSX.Element | null {
  const step = useSelector(
    (state: RootState) => state.investigation.stepper.wizardStep,
  );

  return (
    <div
      className="grow h-44 sm:h-52 2xl:h-72
         w-full relative mx-auto"
    >
      <AnimatePresence mode="wait">
        <RenderStep step={step} />
      </AnimatePresence>
    </div>
  );
}

function RenderStep({ step }: { step: WizardStepType }) {
  switch (step.current) {
    case "idea": {
      return <Step1 key={"idea"} />;
    }
    case "approach": {
      return <Step2 key={"approach"} />;
    }
    case "biases": {
      return <Step3 key={"biases"} />;
    }
    case "premises": {
      return <Step4 key={"premises"} />;
    }
    case "final": {
      return <Step5 key={"final"} />;
    }
  }
}
