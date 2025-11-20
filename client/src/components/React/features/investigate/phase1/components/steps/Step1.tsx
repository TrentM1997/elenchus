import StepsEditor from "@/components/React/global/TipTap/StepsEditor";
import { getIdea } from "@/ReduxToolKit/Reducers/Investigate/UserPOV"
import { useSelector } from "react-redux"
import { RootState } from "@/ReduxToolKit/store"
import { motion } from "framer-motion"
import { stepVariants } from "@/motion/variants"
import Requirements from "../inputs/interactive/Requirements"
import { useCheckFirstStep } from "@/hooks/useCheckFirstStep"
import React from "react";
import type { PaginationStatus } from "@/ReduxToolKit/Reducers/Investigate/Steps"


function Step1() {
      const status: PaginationStatus = useSelector((s: RootState) => s.investigation.stepper.status);
      const idea = useSelector((state: RootState) => state.investigation.pov.idea);
      const selected = useSelector((state: RootState) => state.bluesky.selected);
      useCheckFirstStep();
      const chosenTake = selected
            ? selected
            : idea;

      return (
            <motion.div
                  variants={stepVariants}
                  initial='closed'
                  animate='open'
                  exit='exit'
                  className="flex justify-center items-start gap-2 z-10 
                  absolute inset-0">
                  <div
                        className={`w-full max-w-full overflow-hidden grow-0 max-h-full min-h-44
                        pb-8 sm:pb-7 box-border relative`}>
                        <StepsEditor id="step1" context={chosenTake} setterFunction={getIdea} />
                        <Requirements status={status} />
                  </div>
            </motion.div>
      );
};

export default React.memo(Step1);