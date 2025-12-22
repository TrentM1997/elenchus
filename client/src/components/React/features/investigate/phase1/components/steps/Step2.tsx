import { getPerspective, getExpertise } from "@/state/Reducers/Investigate/UserPOV"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/state/store"
import Perspective from "../inputs/interactive/Perspective"
import Expertise from "../inputs/interactive/Expertise"
import { motion } from "framer-motion";
import { stepVariants } from "@/motion/variants"
import React from "react"

function Step2(): JSX.Element | null {
  const perspective = useSelector((state: RootState) => state.investigation.pov.perspective);
  const expertise = useSelector((state: RootState) => state.investigation.pov.expertise);
  const dispatch = useDispatch();

  const getPOV = (e: React.MouseEvent<HTMLDivElement>) => {

    const targetDiv = e.target as HTMLDivElement
    dispatch(getPerspective(targetDiv.getAttribute('data-set')))
  }

  const assignKnowledge = (e: React.MouseEvent<HTMLDivElement>) => {
    const divTarget = e.target as HTMLDivElement;
    dispatch(getExpertise(divTarget.getAttribute('data-set')))
  }

  const opinions: string[] = [
    "Agree",
    "Disagree",
    "Neutral"
  ]

  const expertiseArray: string[] = [
    "New to the Topic",
    "Familiar",
    "Area of Expertise"
  ]

  return (
    <motion.div
      variants={stepVariants}
      initial='closed'
      animate='open'
      exit='exit'

      className="grid grid-cols-2 justify-between md:gap-x-2 items-center w-full h-full box-border 
      absolute inset-0"
    >
      <div
        className="flex flex-col md:gap-y-2 2xl:gap-y-2.5 gap-y-1 items-center text-center my-auto md:bg-black/65 md:backdrop-blur-sm md:border md:border-outline md:shadow-elev-1
        
           rounded-3xl md:p-2"
      >
        <header className="w-full">
          <h1 className="2xl:text-xl xl:text-xl lg:text-lg md:text-sm text-center text-xs font-light tracking tight text-white mb-2">Your Perspective</h1>
        </header>
        {opinions.map((opinion) => (
          <Perspective key={opinion} opinion={opinion} perspective={perspective} getPOV={getPOV} />
        ))}
      </div>

      <div className="flex flex-col md:gap-y-2 2xl:gap-y-2.5 xs:gap-y-1 items-center text-center my-auto md:backdrop-blur-sm md:border md:border-outline md:shadow-elev-1 md:bg-black/65 md:rounded-3xl md:p-2">
        <header className="w-full">
          <h1 className="2xl:text-xl xl:text-xl lg:text-lg md:text-sm text-center text-xs font-light tracking tight text-white mb-2">Prior Knowledge</h1>
        </header>
        {expertiseArray.map((item) => (
          <Expertise key={item} item={item} expertise={expertise} assignKnowledge={assignKnowledge} />
        ))}
      </div>
    </motion.div>
  );
};


export default React.memo(Step2);