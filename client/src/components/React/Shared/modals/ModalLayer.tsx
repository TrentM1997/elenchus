import { motion } from "framer-motion";
import { popoverVariants, softEase } from "@/motion/variants";
import { createPortal } from "react-dom";

interface ModalLayer {
    children: JSX.Element,
    ariaLabel?: string
}

export default function ModalLayer({ children, ariaLabel }: ModalLayer): JSX.Element {

    const layer: JSX.Element = (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.15, duration: 0.25, type: 'tween', ease: softEase } }}
            exit={{ opacity: 0, transition: { delay: 0, duration: 0.4, type: 'tween', ease: softEase } }}
            className="z-[900] overflow-hidden fixed inset-0

             contain-strict 

             flex justify-center items-center bg-black/70 backdrop-blur-[3px] 
             transform-gpu will-change-[opacity,backdrop-filter,transform]"
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
        >
            {children}
        </motion.div>
    );

    return createPortal(layer, document.body);
};