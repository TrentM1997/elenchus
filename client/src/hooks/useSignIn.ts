import { SetStateAction, useEffect, useState } from "react";
import { supabaseSignIn } from "@/services/supabase/SupabaseData";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { populateArticles } from "@/state/Reducers/UserContent/UserContentReducer"
import { populateResearch } from "@/state/Reducers/UserContent/UserInvestigations"
import { authenticate } from "@/state/Reducers/Athentication/Authentication";

export type SigninStatus = "pending" | "success" | "failed" | "idle";
export type SigninError = 'Invalid email or password' | null;

interface useSignin {
    status: SigninStatus,
    setStatus: React.Dispatch<SetStateAction<SigninStatus>>,
    loginErr?: SigninError
};

export const useSignIn = (
    userEmail: string | null,
    userPassword: string | null): useSignin => {
    const [status, setStatus] = useState<SigninStatus>("idle");
    const [loginErr, setLoginErr] = useState<SigninError>(null);
    const dispatch = useDispatch<AppDispatch>();


    useEffect(() => {
        if (status === null) return;

        const executeSignin = async () => {
            const signin = await supabaseSignIn(userEmail, userPassword);
            if (signin.message === 'success' && signin.session) {
                const { userContent } = signin.session;
                dispatch(authenticate(true));
                dispatch(populateArticles(userContent.userArticles));
                dispatch(populateResearch(userContent.userResearch));
                setStatus("success");
                setLoginErr(null);
            } else {
                setStatus("failed");
                setLoginErr('Invalid email or password');
            }
        };

        if ((status === "pending")) {
            executeSignin()
        }

    }, [status]);


    return { status, setStatus, loginErr };

};