import { motion } from "framer-motion";
import { hideTop } from "@/motion/variants";
import { SetStateAction, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import Pending from "@/components/React/session/notifications/Pending";

interface PendingExtracts {
    setShowPendingExtractions: React.Dispatch<SetStateAction<boolean>>
    status: string,

};

export default function PendingExtractions({ setShowPendingExtractions, status }: PendingExtracts): JSX.Element | null {
    const progress = useSelector((state: RootState) => state.investigation.read.progress);
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


    return (
        <motion.div
            aria-label="Pending extracts notification"
            variants={hideTop}
            initial='hide'
            animate='show'
            exit='hide'
            transition={{ type: 'tween', duration: 0.2 }}
            className="fixed top-24 right-36 h-10 w-60 p-2 bg-mirage border border-zinc-700 rounded-xl px-2 z-20"
        >
            <div key='title' className="flex w-full h-full items-center justify-between">
                <div key='titleContainer' className="w-auto h-fit">
                    <p className="text-white font-light text-sm">
                        {`extration progress: ${progress}`}
                    </p>
                </div>
                <div className="w-auto h-fit relative">
                    <Pending key={'pending-status'} />
                </div>
            </div>
        </motion.div>
    )
} 