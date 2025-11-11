import { motion } from "framer-motion";
import { popoverVariants } from "@/motion/variants";
import { createPortal } from "react-dom";

interface ModalLayer {
    children: JSX.Element
}

export default function ModalLayer({ children }): JSX.Element {

    const layer: JSX.Element = (
        <motion.div
            variants={popoverVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="z-50 fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-[3px] will-change-[opacity,backdrop-filter]"
        >
            {children}
        </motion.div>
    );

    return createPortal(layer, document.body);
};