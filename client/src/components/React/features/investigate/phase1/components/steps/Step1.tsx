import { selectPOVData } from "@/state/Reducers/Investigate/pov/selectors";
import StepsEditor from "@/components/React/global/TipTap/StepsEditor";
import { updatePOVDraft } from "@/state/Reducers/Investigate/pov/thunks";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { motion } from "framer-motion";
import { stepVariants } from "@/motion/variants";
import Requirements from "../inputs/interactive/Requirements";
import { useCheckFirstStep } from "@/hooks/useCheckFirstStep";
import React from "react";

function Step1() {
  const status = useSelector((s: RootState) => s.investigation.stepper.status);
  const idea = useSelector((state: RootState) => selectPOVData(state).idea);
  useCheckFirstStep();

  return (
    <motion.div
      variants={stepVariants}
      initial={false}
      animate="open"
      exit="exit"
      className="flex justify-center items-start gap-2 z-10 
                  absolute inset-0"
    >
      <div
        className={`w-full max-w-full overflow-hidden grow-0 max-h-full min-h-44
                        pb-8 sm:pb-7 box-border relative`}
      >
        <StepsEditor
          id="step1"
          context={idea}
          setterFunction={(idea: string) => updatePOVDraft({ idea })}
        />
        <Requirements status={status} />
      </div>
    </motion.div>
  );
}

export default React.memo(Step1);
