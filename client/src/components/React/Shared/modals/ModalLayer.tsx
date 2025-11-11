import { motion } from "framer-motion";
import { popoverVariants } from "@/motion/variants";
import { createPortal } from "react-dom";

interface ModalLayer {
    children: JSX.Element,
    ariaLabel?: string
}

export default function ModalLayer({ children, ariaLabel }: ModalLayer): JSX.Element {

    const layer: JSX.Element = (
        <motion.div
            variants={popoverVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="z-50 fixed inset-0 flex justify-center items-center
             bg-black/60 backdrop-blur-[3px] will-change-[opacity,backdrop-filter]"
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
        >
            {children}
        </motion.div>
    );

    return createPortal(layer, document.body);
};