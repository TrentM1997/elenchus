import { animate, motion } from "framer-motion"
import { variants } from "@/motion/variants"

const divProps = {
    variants: variants,
    initial: 'closed',
    animate: 'open',
    exit: 'closed',
    transition: { type: 'tween', duration: 0.2, ease: 'easeInOut' }
};


export default function HighlightTextTip() {


    return (
        <motion.div
            className="w-full py-6"
            {...divProps}>



            <div className="flex items-center justify-center">
                <p className="text-sm leading-7 text-zinc-300 font-light">
                    Highlight a word or phrase in the article to look it up on Wikipedia.
                </p>
            </div>

        </motion.div>
    )
}