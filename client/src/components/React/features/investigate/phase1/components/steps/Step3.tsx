import { updatePOVDraft } from "@/state/Reducers/Investigate/pov/thunks";
import { selectPOVData } from "@/state/Reducers/Investigate/pov/selectors";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/state/store";
import Biases from "../inputs/interactive/Biases";
import { motion } from "framer-motion";
import { stepVariants } from "@/motion/variants";
import React from "react";

function Step3(): JSX.Element | null {
  const { biases } = useSelector(selectPOVData);
  const dispatch = useDispatch<AppDispatch>();

  const opinions: string[] = [
    "Inclined to believe the idea",
    "Inclined to not believe/disprove the idea",
    "Don't have an opinion on the idea",
  ];

  return (
    <motion.div
      variants={stepVariants}
      initial="closed"
      animate="open"
      exit="exit"
      className="max-w-full absolute inset-0
    flex flex-col justify-center items-center px-2 xl:px-0 basis-full"
    >
      <div className="w-full flex items-center justify-center h-auto md:h-full">
        <div className="flex w-full items-center justify-center box-border  md:bg-black/65 md:backdrop-blur-sm md:border md:border-outline md:shadow-elev-1 p-3.5 rounded-3xl">
          <div className="flex flex-col md:gap-y-3 xs:gap-y-1 items-center justify-center text-center my-auto ">
            <header className="w-full">
              <h1
                className="2xl:text-xl xl:text-lg lg:text-base md:text-sm md:text-left xl:text-center text-xs  
              font-light tracking tight text-slate-300 mb-2"
              >
                I would describe my feelings towards the idea as ...
              </h1>
            </header>
            {opinions.map((opinion) => (
              <Biases
                key={opinion}
                opinion={opinion}
                biases={biases}
                getPOV={() => dispatch(updatePOVDraft({ biases: opinion }))}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default React.memo(Step3);
