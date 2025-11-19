import { softEase } from "@/motion/variants";
import { motion } from "framer-motion";

interface HeroWrapper {
    children: JSX.Element | JSX.Element[]
}

export default function HeroWrapper({ children }: HeroWrapper): JSX.Element | null {

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                type: 'tween',
                duration: 0.3,
                ease: softEase,
            }}
            className={`w-full h-auto mx-auto relative`}
        >
            {children}
        </motion.div>
    );
};