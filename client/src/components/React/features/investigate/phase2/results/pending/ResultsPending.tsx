import { variants } from "@/motion/variants"
import { motion } from "framer-motion"


export default function ResultsPending(): JSX.Element | null {

    return (
        <motion.section
            variants={variants}
            initial='closed'
            animate='open'
            exit='closed'
            transition={{ type: 'tween', duration: 0.2, ease: [0.33, 0, 0.67, 1] }}
            className="h-168 w-full mx-auto flex items-start justify-center ease-soft relative"
        >
            <div className="flex items-center justify-center absolute inset-0">
                <h1 className="inline-block bg-gradient-to-r from-zinc-600 via-zinc-200 to-zinc-600 
         bg-[length:200%_100%] bg-clip-text text-transparent tracking-tight animate-shimmer text-lg w-fit h-fit lg:text-3xl">
                    Results pending...
                </h1>
            </div>
        </motion.section>
    )
};