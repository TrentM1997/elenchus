import { clearAuthSlice } from "@/ReduxToolKit/Reducers/Athentication/Authentication";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { logOut } from "@/infra/api/logOut";
import AuthNotification from "@/components/React/session/notifications/AuthNotification";
import { useNavigate } from "react-router-dom";
import { SigninStatus } from "@/hooks/useSignIn";
import { useClearUser } from "@/hooks/useClearUser";
import { wait } from "@/helpers/Presentation";
import { renderModal } from "@/ReduxToolKit/Reducers/RenderingPipelines/PipelineSlice";

export default function SignOutModal(): JSX.Element {
    const [status, setStatus] = useState<SigninStatus>('idle');
    useClearUser(status);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const timerRef = useRef<number | null>();

    async function redirect(): Promise<void> {
        dispatch(renderModal(null));
        await wait(500);
        navigate('/');
    };

    useEffect(() => {

        const executeSignOut = async (): Promise<void> => {
            try {

                const data: SignOutResponse = await logOut();
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
                redirect();
            }
        }

    }, [status]);


    return (

        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="signout-title"
            className="z-[910] relative opacity-0 animate-fade-blur animation-delay-500ms will-change-[opacity] pointer-events-auto
         xl:min-w-96 xl:min-h-80 w-80 h-60 flex flex-col items-start gap-x-8 gap-y-6 rounded-3xl p-8 
        sm:gap-y-10 sm:p-10 lg:col-span-2 lg:flex-row lg:items-center bg-black border border-border_gray
        text-center">
            <AnimatePresence>
                {(status !== 'idle') && <AuthNotification id="signout" status={status} setStatus={setStatus} action="Sign out" />}
            </AnimatePresence>
            <div className="lg:min-w-0 lg:flex-1 max-w-sm mx-auto">
                <p id="signout-title" className="text-white xl:text-4xl">Sign out</p>
                <p className="mt-4">
                    <span className="text-2xl font-lighter text-white" />
                    <span className="text-base font-medium text-zinc-400">are you sure?</span>
                </p>
                <p className="mx-auto mt-6 text-sm text-white" />
                <div className="inline-flex flex-no-wrap gap-x-2 md:gap-x-4 items-center mt-8 w-full">

                    <motion.button
                        aria-label="Confirm sign out"
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'tween', duration: 0.2 }}
                        onClick={() => setStatus('pending')} type="button"
                        className="text-sm py-2 w-full px-6 md:px-4 border md:focus:ring-2 rounded-full border-transparent 
                    bg-white md:hover:bg-white/10 text-black lg:text-base
                    md:hover:text-white inline-flex items-center justify-center transition-all duration-300 ease-soft">
                        Yes
                    </motion.button>
                    <motion.button
                        aria-label="Cancel sign out"
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'tween', duration: 0.2 }}
                        onClick={() => dispatch(renderModal(null))} type="button"
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
    );

};


