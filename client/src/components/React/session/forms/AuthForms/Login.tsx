import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AuthNotification from "@/components/React/session/notifications/AuthNotification";
import ScrolltoTop from "@/helpers/ScrollToTop";
import LoginOperations from "@/components/React/session/forms/containers/LoginOperations";
import { useCheckCredentials } from "@/hooks/useCheckCredentials";
import { useSignIn } from "@/hooks/useSignIn";
import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";

export default function Login(): JSX.Element {
    const activeSession = useSelector((state: RootState) => state.auth.activeSession);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [userPassword, setUserPassword] = useState<string | null>(null);
    const { status, setStatus } = useSignIn(userEmail, userPassword);
    const { acceptedInput, validEmail } = useCheckCredentials(userEmail, userPassword);
    const navigate = useNavigate();


    const submitAuth = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        e.preventDefault();
        if ((acceptedInput === true) && (userPassword)) {
            setStatus("pending")
        }
    };

    useEffect(() => {
        if (!activeSession) return;

        const timer = window.setTimeout(() => {
            if (activeSession) {
                navigate('/');
            };
        }, 1000);

        return () => {
            clearTimeout(timer);
        };

    }, [status]);


    return (
        <section
            className="lg:p-8 overflow-hidden bg-black animate-fade-in"
        >
            <ScrolltoTop />
            <AnimatePresence>
                {status &&
                    <AuthNotification
                        status={status}
                        setStatus={setStatus}
                        action="Login"
                    />
                }
            </AnimatePresence>
            <div className="mx-auto 2xl:max-w-7xl py-24 lg:px-16 md:px-12 px-8 xl:px-36">
                <div className="border-b pb-12">
                    <p className="text-3xl tracking-tight font-light lg:text-4xl text-white">
                        Log in.
                    </p>
                    <p className="mt-2 text-sm text-zinc-400">log in to manage your saved content.</p>
                </div>
                <LoginOperations
                    submitAuth={submitAuth}
                    status={status}
                    setUserEmail={setUserEmail}
                    setUserPassword={setUserPassword}
                    validEmail={validEmail}
                    acceptedInput={acceptedInput}
                />
            </div>
        </section>
    )
};