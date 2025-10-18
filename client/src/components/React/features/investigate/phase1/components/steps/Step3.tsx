import { getBiases } from "@/ReduxToolKit/Reducers/Investigate/UserPOV"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/ReduxToolKit/store"
import Biases from "../inputs/interactive/Biases"
import { motion } from "framer-motion"
import { variants } from "@/motion/variants"
import React from "react"

function Step3(): JSX.Element | null {
  const biases = useSelector((state: RootState) => state.investigation.pov.biases);
  const dispatch = useDispatch()

  const getPOV = (e: React.MouseEvent<HTMLDivElement>) => {

    const targetDiv = e.target as HTMLDivElement
    dispatch(getBiases(targetDiv.getAttribute('data-set')))
  }

  const opinions: string[] = [
    "Inclined to believe the idea",
    "Inclined to not believe/disprove the idea",
    "Don't have an opinion on the idea"
  ]

  return (
    <motion.div
      variants={variants}
      initial='closed'
      animate='open'
      exit='closed'
      transition={{ type: 'tween', duration: 0.2 }}
      className='max-w-full absolute inset-0
    flex flex-col justify-center items-center px-2 xl:px-0 basis-full'>

      <div className="w-full flex items-center justify-center h-auto md:h-full">

        <div className="flex w-full items-center justify-center box-border  md:bg-black/65 md:backdrop-blur-sm md:border md:border-outline md:shadow-elev-1 p-3.5 rounded-3xl">
          <div
            className="flex flex-col md:gap-y-3 xs:gap-y-1 items-center justify-center text-center my-auto "
          >
            <header className="w-full">
              <h1 className="2xl:text-xl xl:text-lg lg:text-base md:text-sm md:text-left xl:text-center text-xs  
              font-light tracking tight text-slate-300 mb-2">I would describe my feelings towards the idea as ...</h1>
            </header>
            {opinions.map((opinion) => (
              <Biases key={opinion} opinion={opinion} biases={biases} getPOV={getPOV} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};


export default React.memo(Step3);