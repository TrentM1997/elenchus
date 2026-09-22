import { updatePOVDraft } from "@/state/Reducers/Investigate/pov/thunks";
import { selectPOVData } from "@/state/Reducers/Investigate/pov/selectors";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/state/store";
import Perspective from "../inputs/interactive/Perspective";
import Expertise from "../inputs/interactive/Expertise";
import { motion } from "framer-motion";
import { stepVariants } from "@/motion/variants";
import React from "react";
import {
  ExpertiseSchemaType,
  PerspectiveSchemaType,
} from "@/lib/schemas/investigations/InvestigationSchema";

function Step2(): JSX.Element | null {
  const { perspective, expertise } = useSelector(selectPOVData);
  const dispatch = useDispatch<AppDispatch>();

  const opinions: PerspectiveSchemaType[] = ["Agree", "Disagree", "Neutral"];

  const expertiseArray: ExpertiseSchemaType[] = [
    "New to the Topic",
    "Familiar",
    "Area of Expertise",
  ];

  return (
    <motion.div
      variants={stepVariants}
      initial="closed"
      animate="open"
      exit="exit"
      className="grid grid-cols-2 justify-between md:gap-x-2 items-center w-full h-full box-border 
      absolute inset-0"
    >
      <div
        className="flex flex-col md:gap-y-2 2xl:gap-y-2.5 gap-y-1 items-center text-center my-auto md:bg-black/65 md:backdrop-blur-sm md:border md:border-outline md:shadow-elev-1
        
           rounded-3xl md:p-2"
      >
        <header className="w-full">
          <h1 className="2xl:text-xl xl:text-xl lg:text-lg md:text-sm text-center text-xs font-light tracking tight text-white mb-2">
            Your Perspective
          </h1>
        </header>
        {opinions.map((opinion) => (
          <Perspective
            key={opinion}
            opinion={opinion}
            perspective={perspective}
            getPOV={() => dispatch(updatePOVDraft({ perspective: opinion }))}
          />
        ))}
      </div>

      <div className="flex flex-col md:gap-y-2 2xl:gap-y-2.5 xs:gap-y-1 items-center text-center my-auto md:backdrop-blur-sm md:border md:border-outline md:shadow-elev-1 md:bg-black/65 md:rounded-3xl md:p-2">
        <header className="w-full">
          <h1 className="2xl:text-xl xl:text-xl lg:text-lg md:text-sm text-center text-xs font-light tracking tight text-white mb-2">
            Prior Knowledge
          </h1>
        </header>
        {expertiseArray.map((item) => (
          <Expertise
            key={item}
            item={item}
            expertise={expertise}
            assignKnowledge={() =>
              dispatch(updatePOVDraft({ expertise: item }))
            }
          />
        ))}
      </div>
    </motion.div>
  );
}

export default React.memo(Step2);
