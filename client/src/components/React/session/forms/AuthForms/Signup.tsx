import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/state/store"
import { Link, useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { NewEmail, NewPassword, OAuthLogins, ConfirmSignupPassword } from "@/components/React/session/forms/InputFields"
import NewPasswordGuide from "../InputGuides/NewPasswordGuide"
import AuthNotification from "@/components/React/session/notifications/AuthNotification"
import type { SigninStatus } from "@/hooks/useSignIn"
import { useSignupValidation } from "@/hooks/auth/useSignupValidation"
import { newUser } from "@/services/supabase/SupabaseData"
import { authenticate } from "@/state/Reducers/Athentication/Authentication"



export default function Signup() {
    const activeSession = useSelector((state: RootState) => state.auth.activeSession);
    const [status, setStatus] = useState<SigninStatus>('idle');
    const navigate = useNavigate();
    const { fieldStatus, setFieldValue, canSubmit, fields } = useSignupValidation();
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (!activeSession) return;

        const timer = setTimeout(() => {
            navigate('/dashboard')
        }, 2500);

        return () => clearTimeout(timer);
    }, [activeSession]);


    const submitNewUserRequest = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
        e.preventDefault();
        setStatus('pending');
        const result = await newUser(fields.email, fields.password);
        setStatus((result.ok) ? 'success' : 'failed');
        dispatch(authenticate(true))
    }


    useEffect(() => {
        if (status !== 'success') return;

        const timer = window.setTimeout(() => {
            navigate('/dashboard');
        }, 2000)

        return () => {
            clearTimeout(timer);
        }
    }, [status])


    return (
        <section className="lg:p-8 min-h-dvh overflow-hidden bg-black animate-fade-in relative">
            <AnimatePresence>
                {(status !== 'idle') && <AuthNotification action="Account creation" status={status} setterFunction={setStatus} />}
            </AnimatePresence>
            <div className="mx-auto 2xl:max-w-7xl py-12 sm:py-24 lg:px-16 md:px-12 px-8 xl:px-36">
                <div className="border-b pb-4 sm:pb-12">
                    <p className="text-2xl tracking-tight font-light lg:text-4xl text-white">
                        Sign up.
                    </p>
                    <p className="mt-2 text-sm text-zinc-400">Create an account with us.</p>
                </div>
                {/*   ERROR MESSAGE HERE  */}
                <motion.div
                    className="w-full gap-6 sm:gap-24 mx-auto grid grid-cols-1 mt-12 lg:grid-cols-2 items-start relative">
                    <form>
                        <div className="space-y-4">
                            <NewEmail emailStatus={fieldStatus.e} setFieldValue={setFieldValue} />
                            <NewPassword setFieldValue={setFieldValue} passwordStatus={fieldStatus.p} />
                            <ConfirmSignupPassword confirmStatus={fieldStatus.c} setFieldValue={setFieldValue} />
                            <div className="col-span-full">
                                <button
                                    onClick={(e) => submitNewUserRequest(e)}
                                    disabled={!canSubmit}
                                    type="submit"
                                    className={`
                                            ${canSubmit ? 'opacity-100' : 'opacity-60'}
                                            transition-opacity ease-soft will-change-[opacity]
                                            text-sm py-2 px-4 border focus:ring-2 h-10 rounded-full border-zinc-100 
                                bg-white hover:bg-black text-black duration-200 focus:ring-offset-2 focus:ring-white hover:text-white
                                 w-full inline-flex items-center justify-center ring-1 ring-transparent`}>
                                    Submit
                                </button>
                            </div>
                            <div>
                                <p className="font-medium text-sm leading-tight text-white mx-auto"> Already a member?
                                    <Link className="text-white underline hover:text-blue-400 ml-3" to={'/Login'}>
                                        Log in now
                                    </Link>
                                </p>
                            </div>
                        </div>
                        <AnimatePresence>
                            {!canSubmit && <NewPasswordGuide />}
                        </AnimatePresence>
                    </form>

                    <OAuthLogins />
                </motion.div>
            </div>
        </section>
    )
}