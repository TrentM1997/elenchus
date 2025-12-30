import { useState, useLayoutEffect, useEffect } from "react"
import { NewPassword, ConfirmNewPassword } from "@/components/React/session/forms/InputFields"
import { Link, useNavigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { pwReset } from "@/lib/services/supabase/SupabaseData"
import AuthNotification from "../../notifications/AuthNotification"
import { SigninStatus } from "@/hooks/useSignIn"
import { useValidateNewPassword } from "@/hooks/auth/useValidateNewPassword"

export default function ResetPassword({ }) {
    const [status, setStatus] = useState<SigninStatus>('idle');
    const [storedEmail, setStoredEmail] = useState<string | null>(null);
    const { fields, fieldStatus, setFieldValue, canSubmit } = useValidateNewPassword()
    const navigate = useNavigate()

    const submitReset = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setStatus('pending')

        const result = await pwReset(storedEmail, fields.password);
        if (result.id) {
            setStatus('success')
        } else {
            setStatus('failed');
        }
    };

    useEffect(() => {
        if (status !== "success") return;


        const timer = window.setTimeout(() => {
            navigate('/login');
        }, 2500)

        return () => {
            clearTimeout(timer);
        }
    }, [status])


    useLayoutEffect(() => {

        const stored = window.localStorage.getItem('email_for_pw_reset');

        if (stored) {
            const parsed = JSON.parse(stored);
            const emailStored = parsed.email;
            setStoredEmail(emailStored);
            window.localStorage.removeItem('email_for_pw_reset');
        }

    }, []);


    return (
        <div className="w-full max-w-md md:max-w-sm mx-auto">
            <AnimatePresence>
                {(status === 'pending') && <AuthNotification setStatus={setStatus} status={status} />}
            </AnimatePresence>
            <div className="flex flex-col">
                <div className="border-b pb-12">
                    <p className="text-3xl tracking-tight font-light lg:text-4xl text-white">
                        Reset password
                    </p>
                    <p className="mt-2 text-sm text-zinc-400">
                        Enter your new password below
                    </p>
                </div>
            </div>
            <form className="mt-12">
                <div className="space-y-6">
                    <NewPassword passwordStatus={fieldStatus.p} setFieldValue={setFieldValue} />
                    <ConfirmNewPassword confirmStatus={fieldStatus.c} setFieldValue={setFieldValue} />
                    <div className="col-span-full">
                        <button
                            onClick={(e) => submitReset(e)}
                            disabled={!canSubmit}
                            type="button" className="text-sm py-2 px-4 border focus:ring-2 h-10 rounded-full border-zinc-100 
                        bg-white hover:bg-black/10 text-black duration-200 focus:ring-offset-2 focus:ring-white hover:text-white w-full inline-flex items-center 
                        justify-center ring-1 ring-transparent">
                            Submit
                        </button>
                    </div>
                    <div>
                        <Link to={'/login'} >
                            <p className="font-medium text-sm leading-tight text-white mx-auto">
                                Already have a password? <a className="text-white underline hover:text-blue-400 ml-3" href="#">Log in instead</a>
                            </p>
                        </Link>

                    </div>
                </div>
            </form>
        </div>
    )
}