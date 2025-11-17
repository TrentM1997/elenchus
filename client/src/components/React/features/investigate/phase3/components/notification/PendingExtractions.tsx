import { motion } from "framer-motion";
import { extractionToastVariants } from "@/motion/variants";
import { SetStateAction, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import type { Prog } from "@/ReduxToolKit/Reducers/Investigate/Reading";
import { createPortal } from "react-dom";

interface PendingExtracts {
    setShowPendingExtractions: React.Dispatch<SetStateAction<boolean>>
    status: string,

};

export default function PendingExtractions({ setShowPendingExtractions, status }: PendingExtracts): JSX.Element | null {
    const progress: Prog = useSelector((state: RootState) => state.investigation.read.progress);
    const remove: boolean = ((status === 'fulfilled') || (status === 'rejected'));

    useEffect(() => {
        if (!remove) return;

        const timer = window.setTimeout(() => {

            setShowPendingExtractions(false)
        }, 500);

        return () => {
            clearTimeout(timer);
        }
    }, [remove]);


    const toast: JSX.Element = (
        <motion.div
            aria-label="Pending extracts notification"
            variants={extractionToastVariants}
            initial='initial'
            animate='animate'
            exit='exit'
            className="lg:fixed relative lg:left-16 lg:mx-0 top-4 md:top-12 lg:top-16 
            h-10 w-[15.5rem] ring-2 ring-white/20 backdrop-blur-sm transform-gpu 
            will-change-transform p-2 rounded-xl px-2.5 z-[900]"
        >
            <div key='title' className="flex w-full h-full items-center justify-between">
                <div key='titleContainer' className="w-auto h-fit">
                    <p className="text-white text-sm flex items-center gap-x-2.5">
                        <span className="text-white/70">extraction progress  </span> <span className="">{`[${progress}]`}</span>
                    </p>
                </div>
                <div className="w-auto h-fit relative">
                    <PulseDot key={'pending-status'} />
                </div>
            </div>

        </motion.div>
    );


    return createPortal(toast, document.getElementById('portal-root'));
};


function PulseDot() {


    return (
        <div className="flex justify-center">
            <span className="relative flex h-4 w-4">
                <span
                    className="absolute inline-flex h-full w-full transform-gpu will-change-transform ease-soft animate-ping rounded-full bg-white/80 opacity-75"
                ></span>
                <span
                    className="relative inline-flex h-4 w-4 rounded-full bg-white"
                ></span>
            </span>
        </div>
    )
}