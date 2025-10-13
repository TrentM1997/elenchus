import DelayedFallback from "@/components/React/Shared/fallbacks/DelayedFallback"
import { variants } from "@/motion/variants"
import { motion } from "framer-motion"


export default function ResultsPending(): JSX.Element | null {

    return (
        <motion.section
            variants={variants}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2, type: 'tween', ease: [0.65, 0, 0.35, 1] } }}
            exit={{ opacity: 0, transition: { type: 'tween', duration: 0.2, ease: [0.65, 0, 0.35, 1] } }}
            className="h-full w-full mx-auto flex items-start justify-center py-24 ease-soft"
        >
            <DelayedFallback>
                <div className="h-44 w-full flex items-center justify-center">
                    <h1 className="inline-block bg-gradient-to-r from-zinc-600 via-zinc-200 to-zinc-600 
         bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer text-lg w-fit h-fit xl:text-2xl">
                        Results pending...
                    </h1>
                </div>
            </DelayedFallback>
        </motion.section>
    )
};