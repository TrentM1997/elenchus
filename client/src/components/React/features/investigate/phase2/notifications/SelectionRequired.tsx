import { useEffect } from "react"
import { motion } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import { InvestigateState } from "@/state/Reducers/Root/InvestigateReducer"
import { RootState } from "@/state/store"
import { createPortal } from "react-dom"
import { populateTooltip } from "@/state/Reducers/Investigate/Rendering"

export default function SelectionRequired() {
    const investigateState: InvestigateState = useSelector((state: RootState) => state.investigation);
    const { chosenArticles } = investigateState.getArticle;
    const dispatch = useDispatch()
    const max = 3;

    useEffect(() => {

        const timer = setTimeout(() => {
            dispatch(populateTooltip(null))
        }, 5000)

        return () => clearTimeout(timer)
    })

    const variants = {
        closed: {
            opacity: 0,
        },
        open: {
            opacity: 1,
        }
    }


    const modal = (
        <motion.div
            key='noSelectedLinks'
            variants={variants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: 'tween', duration: 0.3, ease: [0.33, 0, 0.67, 1] }}
            className="fixed inset-0 bg-black/60 pointer-events-auto z-[100"
        >
            <div className="absolute z-[100] bottom-24 2xl:right-16 opacity-0 animate-fade-blur animation-delay-200ms transition-opacity
            w-72 h-40 p-3 bg-slate-200 rounded-lg flex flex-col items-center
        border border-astro_gray shadow-material">
                <div className="w-full flex flex-col gap-y-4 items-start justify-start h-auto p-2">
                    <h1 className="text-black text-wrap text-base w-full font-light tracking-tight">
                        Select at least one article to retrieve content!
                    </h1>

                    <h2 className="text-black text-wrap text-base w-full font-light tracking-tight">
                        Current Selection: {`${chosenArticles.length}/${max}`}
                    </h2>
                </div>
            </div>


        </motion.div>
    );


    return createPortal(modal, document.body);
};


