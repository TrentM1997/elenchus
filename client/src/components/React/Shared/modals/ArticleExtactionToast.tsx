import { motion } from "framer-motion";
import { variants } from "@/motion/variants";
import { createPortal } from "react-dom";
import { SetStateAction } from "react";
import { ExtractionToast } from "../../app/App";

interface ArticleExtractionToast {
    setShowToast: React.Dispatch<SetStateAction<boolean>>
};

export default function ArticleExtractionToast({ setShowToast }): JSX.Element | null {

    const handleClick = (): void => {
        const TOASTKEY = 'extraction-toast:v1';
        const toastStored = window.sessionStorage.getItem(TOASTKEY);
        const toast: ExtractionToast | null = JSON.parse(toastStored) ?? null;
        if (toast) {
            const updatedToast: ExtractionToast = { shownToast: true };
            window.sessionStorage.setItem(TOASTKEY, JSON.stringify(updatedToast));
        }
        setShowToast(false);
    };

    const toast = (
        <motion.div
            variants={variants}
            initial={'closed'}
            animate={{ opacity: 1, transition: { type: 'tween', duration: 0.2, delay: 0.5, ease: [0.33, 0, 0.67, 1] } }}
            exit={{ opacity: 1, scale: 0, transition: { type: 'tween', duration: 0.2, delay: 0.15, ease: [0.33, 0, 0.67, 1] } }}
            className="fixed inset-0 flex items-center justify-center bg-black/60 pointer-events-auto">
            <div className="w-88 h-88 lg:h-88 lg:w-96 rounded-3xl p-6 bg-black border opacity-0 animate-fade-blur animation-delay-400ms transition-opacity ease-soft will-change-[opacity] transform-gpu border-border_gray">
                <div className="flex flex-col items-center h-full justify-between">
                    <ToastCopy />
                    <GotItButton handleClick={handleClick} />
                </div>
            </div>
        </motion.div>
    )

    return createPortal(toast, document.body);
};


function ToastCopy(): JSX.Element | null {

    return (
        <div className="bg-white rounded-3xl flex flex-col items-center justify-center p-4">
            <div className="w-full h-auto flex items-center justify-center gap-x-3">
                <div className="w-8 h-8 text-amber-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 30 30" width="30px" height="30px">    <path d="M25.983,13.342C25.988,13.228,26,13.116,26,13c0-4.418-3.582-8-8-8c-3.11,0-5.8,1.779-7.123,4.371C10.296,9.136,9.665,9,9,9 c-2.53,0-4.599,1.885-4.932,4.324C1.703,14.129,0,16.363,0,19c0,3.314,2.686,6,6,6h18c3.314,0,6-2.686,6-6 C30,16.382,28.321,14.162,25.983,13.342z M18.721,19.372c0.372,0.372,0.373,0.976,0,1.349c-0.373,0.373-0.976,0.372-1.349,0 L15,18.349l-2.372,2.372c-0.373,0.373-0.976,0.372-1.349,0c-0.372-0.372-0.373-0.976,0-1.349L13.651,17l-2.372-2.372 c-0.372-0.372-0.373-0.976,0-1.349s0.976-0.372,1.349,0L15,15.651l2.372-2.372c0.373-0.373,0.976-0.372,1.349,0 c0.372,0.372,0.373,0.976,0,1.349L16.349,17L18.721,19.372z" /></svg>

                </div>
                <div className="w-auto h-auto">
                    <h1 className="text-zinc-800 text-lg font-light tracking-tight">
                        Third-party service down
                    </h1>
                </div>
            </div>
            <div className="w-auto h-auto p-6">
                <h1 className="text-black font-light tracking-tight text-base text-wrap">
                    Article extraction is temporarily unavailable. We're switching providers now. You can still search and visit sources. Article extraction will resume soon.
                </h1>
            </div>
        </div>
    )
};

interface GotItButton {
    handleClick: () => void
};

function GotItButton({ handleClick }: GotItButton): JSX.Element | null {

    return (
        <button
            onClick={handleClick}
            type="button"
            className="text-xs sm:text-sm py-2 px-4 border focus:ring-2 rounded-full border-transparent w-32 lg:w-36 
        bg-white hover:bg-white/10 text-black transition-all ease-soft duration-300 focus:ring-offset-2 focus:ring-white 
        hover:text-white flex items-center flex-nowrap justify-center ring-1 ring-transparent cursor-pointer">
            Got it
        </button>
    );
};