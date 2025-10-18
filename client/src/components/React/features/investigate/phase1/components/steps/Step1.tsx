import { useMemo } from "react"
import StepsEditor from "../../../../../Shared/TipTap/StepsEditor"
import { getIdea } from "@/ReduxToolKit/Reducers/Investigate/UserPOV"
import { useSelector } from "react-redux"
import { RootState } from "@/ReduxToolKit/store"
import { motion } from "framer-motion"
import { variants } from "@/motion/variants"
import Requirements from "../inputs/Requirements"
import { useCheckFirstStep } from "@/hooks/useCheckFirstStep"
import React from "react"
import type { InvestigateState } from "@/ReduxToolKit/Reducers/Root/InvestigateReducer"

function Step1() {
      const investigateState: InvestigateState = useSelector((state: RootState) => state.investigation)
      const selected = useSelector((state: RootState) => state.bluesky.selected);
      const { stepper, pov } = investigateState
      const { denied } = stepper
      const { idea } = pov
      useCheckFirstStep();

      const chosenTake = selected
            ? selected
            : idea;

      const status = useMemo((): boolean | null => {
            if (denied) {
                  return false;
            } else if (denied === false) {
                  return true;
            } else {
                  return null;
            }
      }, [denied]);


      return (
            <motion.div
                  variants={variants}
                  initial='closed'
                  animate='open'
                  exit='closed'
                  transition={{ type: 'tween', duration: 0.2 }}
                  className="flex justify-center items-start gap-2 z-10 
                  absolute inset-0">
                  <div
                        className={`w-full max-w-full overflow-hidden grow-0 max-h-full min-h-44
                        pb-8 sm:pb-7 box-border relative`}>
                        <StepsEditor context={chosenTake} setterFunction={getIdea} />
                        <Requirements acceptInput={status} />
                  </div>
            </motion.div>
      );
};

export default React.memo(Step1);