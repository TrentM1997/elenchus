import { useEffect } from "react"
import { motion } from "framer-motion"
import { useDispatch } from "react-redux"
import { variants } from "@/motion/variants"
import React from "react"
import { populateTooltip } from "@/ReduxToolKit/Reducers/Investigate/Rendering"
import { useTooltipFlags } from "@/hooks/useTooltipFlags"


function GuideSelectingArticles({ }) {
    const { setFlag } = useTooltipFlags();
    const dispatch = useDispatch()

    useEffect(() => {

        const timer = setTimeout(() => {
            dispatch(populateTooltip(null))
            setFlag('selectingTooltip', true);
        }, 5000);

        return (() => clearTimeout(timer));

    }, []);

    return (
        <motion.div
            key='selectTooltip'
            variants={variants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: 'tween', duration: 0.2 }}
            className="absolute z-30 xl:right-6 lg:right-60 sm:right-32  bottom-14 sm:bottom-20 right-2 bg-white rounded-lg
         h-auto flex flex-col items-center w-80 lg:w-96 lg:h-80
        border shadow-material after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 
            after:transform after:-translate-x-1/2 after:border-t-[10px] after:border-l-[10px] after:border-r-[10px] after:border-b-0 
            after:border-t-white after:border-l-transparent after:border-r-transparent after:border-b-transparent">

            <div className="max-w-full h-auto p-2 lg:p-6 text-left text-wrap flex flex-col gap-y-6 lg:gap-y-8">
                <h1 className="text-black text-wrap text-2xl lg:text-xl xl:text-3xl  font-light tracking-tight">
                    To Read Aricle Content
                </h1>
                <p className="text-black font-light tracking-tight text-lg lg:text-2xl text-wrap">
                    select up to a maximum of 3 articles, then click this button below to retrieve their contents
                </p>
            </div>
        </motion.div>
    )
};

export default React.memo(GuideSelectingArticles);