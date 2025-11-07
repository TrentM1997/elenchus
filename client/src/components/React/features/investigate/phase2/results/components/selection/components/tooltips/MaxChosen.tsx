import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { variants } from "@/motion/variants";
import React, { SetStateAction, useEffect } from "react";

interface MaxChosen {
    setShowMaxTooltip?: React.Dispatch<SetStateAction<boolean>>
};

function Maxchosen({ }: MaxChosen): JSX.Element | null {


    const modal = (
        <motion.div className="fixed z-50 bottom-24 right-2 md:right-52 lg:right-60 xl:right-128 2xl:right-44
            w-72 h-32 2xl:h-24 2xl:w-60 p-2 bg-slate-200 rounded-lg flex flex-col items-center
        border border-astro_gray shadow-material"
            variants={variants}
            initial='closed'
            animate='open'
            exit='closed'
            transition={{ type: 'tween', duration: 0.2, ease: [0.33, 0, 0.67, 1], delay: 0.5 }}
        >

            <div className="w-full flex flex-col items-center justify-center h-full p-2">

                <div className="text-black  text-wrap text-base h-fit w-full tracking-tight">
                    Maximum amount of articles chosen!
                </div>
            </div>
        </motion.div>
    );

    return createPortal(modal, document.body);
};


export default React.memo(Maxchosen)