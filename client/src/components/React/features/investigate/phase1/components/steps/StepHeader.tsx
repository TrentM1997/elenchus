import HelpButton from "@/components/React/global/Help/buttons/Question";
import { AnimatePresence, motion } from "framer-motion";
import { headerTransitions } from "@/motion/variants";
import React from "react";
import { useStepWizardHeader } from "@/lib/hooks/stepWizard/useStepWizardHeader";

export interface StepHeader {
  title: string;
  subheader?: string | null;
  info: Help[];
}

function StepHeader({ title, subheader, info }: StepHeader) {
  const { propsChanging, display } = useStepWizardHeader({ title, subheader });

  return (
    <div
      className="w-full h-12 lg:h-20 shrink-0 basis-3 sm:basis-4 relative
            text-center mx-auto box-border flex"
    >
      <div
        className="w-full box-border border-b h-7 md:h-8 lg:h-9 border-white/10 mb-2 
            flex flex-row justify-between items-center"
      >
        <AnimatePresence mode="wait">
          {!propsChanging && (
            <motion.div
              key={title}
              variants={headerTransitions}
              initial={false}
              animate="open"
              exit="closed"
              className="w-full h-full flex justify-items-start flex-nowrap"
            >
              <h1
                className="2xl:text-2xl md:text-2xl sm:text-xl text-sm 
                     tracking-tight font-light text-nowrap text-zinc-300 pb-1"
              >
                {display.title}{" "}
                <span className="text-zinc-500">
                  {subheader ? display.subheader : null}
                </span>
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        <HelpButton info={info} />
      </div>
    </div>
  );
}

export default React.memo(StepHeader);
