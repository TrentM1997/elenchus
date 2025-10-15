import { SetStateAction, useEffect } from "react";
import { motion } from "framer-motion";
import { variants } from "@/motion/variants";
import type { TooltipType } from "../buttons/ReturnToSearch";

interface BackToSearchTT {
    setShowBackTooltip: React.Dispatch<SetStateAction<TooltipType | null>>,
    id: TooltipType | null
};

export default function BackToSearchTooltip({ setShowBackTooltip, id }: BackToSearchTT): JSX.Element | null {

    useEffect(() => {

        const timer = window.setTimeout(() => {
            setShowBackTooltip(null);
        }, 10000);

        return () => {
            clearTimeout(timer);
        }
    }, []);


    return (
        <motion.div
            aria-label="Return to search tooltip"
            variants={variants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: "tween", duration: 0.2 }}
            className="absolute z-50 bg-white rounded-lg h-auto w-auto flex flex-col
            bottom-14 -left-2 lg:bottom-12 lg:-left-4
             items-center border border-astro_gray shadow-thick
             after:content-[''] after:absolute after:bottom-[-10px] after:left-4
             after:border-t-[10px] after:border-l-[10px] after:border-r-[10px] after:border-b-0
             after:border-t-white after:border-l-transparent after:border-r-transparent"
        >
            {(id === 'failed') && <FailedScrapeTip />}
            {(id === 'service-down') && <ServiceDownTip />}
        </motion.div>

    )
};



function ServiceDownTip(): JSX.Element | null {

    return (
        <div className="w-full h-auto md:px-1 py-1 md:py-1 2xl:p-2 xl:p-1.5">
            <h1 className="text-black text-wrap text-xs md:text-base md:font-light w-40 h-auto tracking-tighter">
                While the service is down you can still search and visit more sources, click here to return to search.
            </h1>
        </div>
    )
};


function FailedScrapeTip(): JSX.Element | null {

    return (
        <div className="w-full h-auto md:px-1 py-1 md:py-1 2xl:p-2 xl:p-1.5">
            <h1 className="text-black text-wrap text-xs md:text-base md:font-light w-40 h-auto tracking-tighter">
                Go back to search for other articles. You can still choose articles from other sources — the majority allow extraction.
            </h1>
        </div>
    );
};