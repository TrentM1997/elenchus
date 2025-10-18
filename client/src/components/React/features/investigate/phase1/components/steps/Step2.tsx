import { getPerspective, getExpertise } from "@/ReduxToolKit/Reducers/Investigate/UserPOV"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/ReduxToolKit/store"
import Perspective from "../inputs/interactive/Perspective"
import Expertise from "../inputs/interactive/Expertise"
import { motion } from "framer-motion";
import { variants } from "@/motion/variants"
import type { InvestigateState } from "@/ReduxToolKit/Reducers/Root/InvestigateReducer"

export default function Step2({ containerWidth }: any) {
  const investigateState: InvestigateState = useSelector((state: RootState) => state.investigation)
  const { pov } = investigateState;
  const { expertise, perspective } = pov;
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
      variants={variants}
      initial='closed'
      animate='open'
      exit='closed'
      transition={{ type: 'tween', duration: 0.2 }}
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