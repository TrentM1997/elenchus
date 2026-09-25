import { motion } from "framer-motion";
import { softEase } from "@/motion/variants";

interface ModalLayer {
  children: JSX.Element;
  ariaLabel?: string;
  mountDelay?: number;
}

export default function ModalLayer({
  children,
  ariaLabel,
  mountDelay = 0,
}: ModalLayer): JSX.Element {
  return (
    <motion.div
      initial={false}
      animate={{
        opacity: 1,
        transition: {
          delay: mountDelay,
          duration: 0.2,
          type: "tween",
          ease: softEase,
        },
      }}
      exit={{
        opacity: 0,
        transition: {
          delay: 0,
          duration: 0.2,
          type: "tween",
          ease: softEase,
        },
      }}
      className=" overflow-hidden fixed h-screen w-screen
             pointer-events-auto
             contain-paint
             flex justify-center items-center bg-black/70 backdrop-blur-[3px] 
             transform-gpu"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
    >
      {children}
    </motion.div>
  );
}
