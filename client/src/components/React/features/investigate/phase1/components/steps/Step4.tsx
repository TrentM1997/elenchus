import StepsEditor from "@/components/React/global/TipTap/StepsEditor";
import { RootState } from "@/ReduxToolKit/store";
import { useSelector } from "react-redux";
import { getPremises } from "@/ReduxToolKit/Reducers/Investigate/UserPOV";
import { motion } from "framer-motion"
import { stepVariants } from "@/motion/variants"
import React from "react";

function Step4(): JSX.Element | null {
  const premises = useSelector((state: RootState) => state.investigation.pov.premises);

  return (
    <motion.div
      variants={stepVariants}
      initial='closed'
      animate='open'
      exit='exit'
      className='absolute inset-0'>
      <div className="inline-block h-fit box-border mx-auto min-w-full max-w-full 2xl:h-full">
        <div className="flex flex-col items-center w-full 
       xs:px-0 relative lg:rounded-t-[3rem]">
          <div className="text-center relative z-10 w-full">

            <div className="w-full border-none h-44 sm:h-52 xl:h-72 2xl:max-w-168 text-md text-white bg-transparent focus:ring-1 focus:ring-white
     resize-none text-wrap flex justify-items-start">
              <StepsEditor context={premises} setterFunction={getPremises} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


export default React.memo(Step4);