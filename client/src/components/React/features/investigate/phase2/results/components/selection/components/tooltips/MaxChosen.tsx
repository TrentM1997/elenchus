import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { variants, hideBottom } from "@/motion/variants";
import React, { SetStateAction, useEffect } from "react";

interface MaxChosen {
    setShowMaxTooltip?: React.Dispatch<SetStateAction<boolean>>
};

function Maxchosen({ }: MaxChosen): JSX.Element | null {


    const modal = (
        <motion.div className="fixed z-20 bottom-24 lg:bottom-36
            w-88 h-12 rounded-full p-2 bg-slate-300 ring-4 ring-white/15 flex flex-col items-center
        border border-astro_gray shadow-material"
            variants={hideBottom}
            initial='hide'
            animate='show'
            exit='hide'
        >

            <div className="w-full flex items-center justify-between h-full p-2">

                <div className="text-black  text-wrap text-base h-fit w-full tracking-tight">
                    Maximum amount of articles chosen!
                </div>
                <div className="max-h-10 w-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width={'100%'} height={'100%'} viewBox="0 0 24 24" fill="currentColor" className="icon text-button_blue icon-tabler icons-tabler-filled icon-tabler-circle-check"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" /></svg>

                </div>
            </div>
        </motion.div>
    );

    return createPortal(modal, document.getElementById('portal-root'));
};


export default React.memo(Maxchosen)