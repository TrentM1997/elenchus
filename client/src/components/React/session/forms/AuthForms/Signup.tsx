import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/ReduxToolKit/store"
import { Link, useNavigate } from "react-router-dom"
import ErrorBoundary from "@/components/React/global/ErrorBoundaries/ErrorBoundary"
import { AnimatePresence, motion } from "framer-motion"
import NewEmail from "../InputFields/NewEmail"
import NewPassword from "../InputFields/NewPassword"
import ConfirmNewPassword from "../InputFields/ConfirmNewPassword"
import OAuthLogins from "../InputFields/OauthLogins"
import NewPasswordGuide from "../InputGuides/NewPasswordGuide"
import AuthNotification from "@/components/React/session/notifications/AuthNotification";
import { SigninStatus } from "@/hooks/useSignIn"
import { useSignupValidation } from "@/hooks/auth/useSignupValidation"
import { newUser } from "@/services/supabase/SupabaseData"
import { authenticate } from "@/ReduxToolKit/Reducers/Athentication/Authentication"



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

        <ErrorBoundary>
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
                                <ConfirmNewPassword confirmStatus={fieldStatus.c} setFieldValue={setFieldValue} />
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
        </ErrorBoundary>


    )
}


{/* errorMessage && <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: 'tween', duration: 0.2 }}
                        className="text-white flex flex-nowrap lg:text-xl font-light translate-y-6 justify-center">
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="currentColor"
                                className="icon icon-tabler text-yellow-500 icons-tabler-filled icon-tabler-alert-triangle"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 1.67c.955 0 1.845 .467 2.39 1.247l.105 .16l8.114 13.548a2.914 2.914 0 0 1 -2.307 4.363l-.195 .008h-16.225a2.914 2.914 0 0 1 -2.582 -4.2l.099 -.185l8.11 -13.538a2.914 2.914 0 0 1 2.491 -1.403zm.01 13.33l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -7a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z" /></svg>
                        </span>

                        {errorMessage} Please <Link className="mx-2 underline hover:no-underline hover:text-blue-500 transition-all duration-200 ease-in-out" to='/Login'>Log in</Link>
                        instead
                    </motion.div> */}
