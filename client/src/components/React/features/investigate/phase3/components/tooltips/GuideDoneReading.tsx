import { useEffect } from "react"
import { motion } from "framer-motion"
import { useDispatch } from "react-redux"
import { populateTooltip } from "@/ReduxToolKit/Reducers/Investigate/Rendering"
import { useTooltipFlags } from "@/hooks/useTooltipFlags"

const variants = {
    closed: {
        opacity: 0,
        scale: 0,
    },
    open: {
        opacity: 1,
        scale: 1

    }
}

export default function GuideDoneReading({ }) {
    const dispatch = useDispatch();
    const { setFlag } = useTooltipFlags();


    useEffect(() => {

        const timer = setTimeout(() => {
            dispatch(populateTooltip(null));
            setFlag('readingTooltip', true);
        }, 7000);

        return () => (clearTimeout(timer))

    }, []);

    return (
        <motion.div
            variants={variants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: 'tween', duration: 0.2 }}
            className="absolute opacity-0 animate-fade-in z-[910] bg-white rounded-lg h-auto w-auto flex flex-col
            -left-16 bottom-14 md:-left-14 lg:bottom-14
            items-center border border-astro_gray shadow-thick after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 
            after:transform after:-translate-x-1/2 after:border-t-[10px] after:border-l-[10px] after:border-r-[10px] after:border-b-0 
            after:border-t-white after:border-l-transparent after:border-r-transparent after:border-b-transparent"
        >
            <div className="flex items-center justify-center md:px-1 py-1  w-40 h-20">
                <h1 className="text-black text-wrap text-xs md:text-base text-center tracking-tight">
                    Click here when finished reading
                </h1>
            </div>
        </motion.div>
    )
}


