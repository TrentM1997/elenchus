import { motion } from "framer-motion";
import { hideTop, softEase, variants } from "@/motion/variants";
import { SetStateAction, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import Pending from "@/components/React/session/notifications/Pending";
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
            variants={variants}
            initial='closed'
            animate='open'
            exit='closed'
            transition={{ type: 'tween', duration: 0.2, ease: softEase, delay: 0.2 }}
            className="lg:fixed relative lg:left-16 lg:mx-0 top-4 md:top-12 lg:top-16 h-10 w-60 transform-gpu will-change-transform p-2 bg-button_blue border border-border_gray rounded-xl px-2 z-[900]"
        >
            <div key='title' className="flex w-full h-full items-center justify-between">
                <div key='titleContainer' className="w-auto h-fit">
                    <p className="text-white font-light tracking-tight text-sm">
                        {`extration progress... ${progress}`}
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
                    className="absolute inline-flex h-full w-full transform-gpu will-change-transform ease-soft animate-ping rounded-full bg-white/30 opacity-75"
                ></span>
                <span
                    className="relative inline-flex h-4 w-4 rounded-full bg-white"
                ></span>
            </span>
        </div>
    )
}