import { motion } from "framer-motion";
import { variants, softEase } from "@/motion/variants";
import type { SigninError } from "@/hooks/useSignIn";

interface InvalidCredentials {
    error: SigninError
}

export default function InvalidCredentials({ error }: InvalidCredentials): JSX.Element | null {


    return (
        <motion.div
            variants={variants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: 'tween', duration: 0.2, delay: 0.2, ease: softEase }}
            className="h-16 w-full flex items-center justify-start"
        >
            <div className="text-amber-500 font-light tracking-tight text-wrap">
                {error}
            </div>
        </motion.div>
    )
}