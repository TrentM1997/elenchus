import { useState, useEffect, useMemo } from "react"
import StepsEditor from "../../../../../Shared/TipTap/StepsEditor"
import { getIdea } from "@/ReduxToolKit/Reducers/Investigate/UserPOV"
import { acceptedInput, denyIncrement } from "@/ReduxToolKit/Reducers/Investigate/Steps"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/ReduxToolKit/store"
import { distance, motion } from "framer-motion"
import { variants } from "@/motion/variants"
import Requirements from "../inputs/Requirements"
import { useCheckFirstStep } from "@/hooks/useCheckFirstStep"

export default function Step1() {
      const investigateState = useSelector((state: RootState) => state.investigation)
      const selected = useSelector((state: RootState) => state.bluesky.selected);
      const [nextClicked, setNextClicked] = useState<boolean>(false);
      const { stepper, pov } = investigateState
      const { denied } = stepper
      const { idea } = pov
      useCheckFirstStep();
      const dispatch = useDispatch()
      const chosenTake = selected ? selected : idea;
      const status = useMemo((): boolean | null => {
            if (denied) {
                  return false;
            } else if (denied === false) {
                  return true;
            } else {
                  return null;
            }
      }, [denied]);


      useEffect(() => {

            if (nextClicked && (!idea)) dispatch(denyIncrement(true))

            window.addEventListener('nextStepClick', () => {
                  setNextClicked(true)
            })


      }, [idea, selected]);


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

