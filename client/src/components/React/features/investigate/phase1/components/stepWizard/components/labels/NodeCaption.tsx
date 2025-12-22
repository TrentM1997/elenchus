import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { useMemo } from "react";
import { softEase } from "@/motion/variants";

interface Caption {
    caption: string,
    thisStep: number
}

export default function NodeCaption({ caption, thisStep }: Caption): JSX.Element {
    const step: number = useSelector((state: RootState) => state.investigation.stepper.step);
    const showCaption: boolean = (thisStep === step) || (thisStep < step);


    return (
        <motion.div
            className="text-xs lg:text-[0.85rem] text-center bg-transparent
          text-white self-start pt-2 2xl:pt-4 w-7 md:w-10"
            animate={{
                scale: 1,
                opacity: showCaption
                    ? 1
                    : 0
            }}
            transition={{
                type: 'tween',
                duration: 0.2,
                ease: softEase
            }}
        >
            {caption}
        </motion.div>
    );
};