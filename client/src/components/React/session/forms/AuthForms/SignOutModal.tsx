import { createPortal } from "react-dom";
import { clearAuthSlice, showSignOut } from "@/ReduxToolKit/Reducers/Athentication/Authentication";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { fetchSignOut } from "@/services/supabase/SupabaseData";
import AuthNotification from "@/components/React/session/notifications/AuthNotification";
import { useNavigate } from "react-router-dom";
import { SigninStatus } from "@/hooks/useSignIn";
import { useClearUser } from "@/hooks/useClearUser";
import { variants, softEase } from "@/motion/variants";

export default function SignOutModal(): JSX.Element {
    const [status, setStatus] = useState<SigninStatus>('idle');
    useClearUser(status);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const timerRef = useRef<number | null>();

    useEffect(() => {

        const executeSignOut = async (): Promise<void> => {
            try {

                const data: SignOutResponse = await fetchSignOut();
                if (data.loggedOut === true) {
                    setStatus("success");
                    timerRef.current = window.setTimeout(() => {
                        dispatch(clearAuthSlice());
                        timerRef.current = null;
                    }, 2400);
                } else {
                    setStatus('failed');
                }

            } catch (error) {
                console.error(error);
            };

        };

        if (status === 'pending') {
            executeSignOut();
        };

        return () => {
            if (status === 'success') {
                navigate('/');
            }
        }

    }, [status]);


    const modal = (
        <motion.div
            variants={variants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: 'tween', duration: 0.3, ease: softEase }}
            className="fixed inset-0 bg-black/60 pointer-events-auto z-20 flex items-center justify-center"
        >
            <div className="z-50
         xl:min-w-96 xl:min-h-80 w-80 h-60 flex flex-col items-start gap-x-8 gap-y-6 rounded-3xl p-8 
        sm:gap-y-10 sm:p-10 lg:col-span-2 lg:flex-row lg:items-center bg-ebony
        shadow-inset text-center">
                <AnimatePresence>
                    {(status !== 'idle') && <AuthNotification id="signout" status={status} setStatus={setStatus} action="Sign out" />}
                </AnimatePresence>
                <div className="lg:min-w-0 lg:flex-1 max-w-sm mx-auto">
                    <p className="text-white xl:text-4xl">Sign out</p>
                    <p className="mt-4">
                        <span className="text-2xl font-lighter text-white" />
                        <span className="text-base font-medium text-zinc-400">are you sure?</span>
                    </p>
                    <p className="mx-auto mt-6 text-sm text-white" />
                    <div className="inline-flex flex-no-wrap gap-x-2 md:gap-x-4 items-center mt-8 w-full">

                        <motion.button whileTap={{ scale: 0.95 }}
                            transition={{ type: 'tween', duration: 0.2 }}
                            onClick={() => setStatus('pending')} type="button"
                            className="text-sm py-2 w-full px-6 md:px-4 border md:focus:ring-2 rounded-full border-transparent 
                    bg-white md:hover:bg-white/10 text-black lg:text-base
                    md:hover:text-white inline-flex items-center justify-center transition-all duration-300 ease-soft">
                            Yes
                        </motion.button>
                        <motion.button whileTap={{ scale: 0.95 }}
                            transition={{ type: 'tween', duration: 0.2 }}
                            onClick={() => dispatch(showSignOut())} type="button"
                            className="text-sm py-2 w-full px-6 md:px-4 border md:focus:ring-2 rounded-full border-transparent 
                    bg-white md:hover:bg-white/10 text-black lg:text-base 
                    md:hover:text-white inline-flex items-center justify-center 
                    transition-all duration-300 ease-soft"
                        >
                            No
                        </motion.button>
                    </div>
                </div>
            </div>

        </motion.div>

    )

    return (
        createPortal(modal, document.body)
    )
};


