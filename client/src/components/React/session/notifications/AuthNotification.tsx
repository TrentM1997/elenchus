import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import Success from "./Success";
import Failed from "./Failed";
import Pending from "./Pending";
import { hideTop } from "@/motion/variants";
import { createPortal } from "react-dom";
import { AuthNotificationProps } from "@/env";


export default function AuthNotification({ status, setStatus, action }: AuthNotificationProps) {

    useEffect(() => {

        const timer = window.setTimeout(() => {
            if (status !== null) {
                setStatus(null);

            }

        }, 2000);

        return () => clearTimeout(timer);

    }, [status]);


    const notification = (
        <motion.div
            key='accountCreationNotification'
            variants={hideTop}
            initial='hide'
            animate='show'
            exit='hide'
            transition={{ type: 'tween', duration: 0.2 }}
            className="fixed top-24 right-36 h-10 w-60 p-2 bg-mirage border border-zinc-700 rounded-xl px-2"
        >
            <div key='title' className="flex w-full h-full items-center justify-between">
                <div key='titleContainer' className="w-auto h-fit">
                    <p className="text-white font-light text-sm">
                        {`${action} ${status}`}
                    </p>
                </div>
                <div className="w-auto h-fit relative">
                    {<AnimatePresence mode="wait">
                        {status === "pending" && <Pending key={'pending-status'} />}
                        {status === "success" && <Success key={'success-status'} />}
                        {status === "failed" && <Failed key={'failed-status'} />}
                    </AnimatePresence>}
                </div>
            </div>
        </motion.div>
    );

    return createPortal(notification, document.body);
};