import { SetStateAction, useEffect, useState } from "react";
import { supabaseSignIn } from "@/services/supabase/SupabaseData";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/ReduxToolKit/store";
import { populateArticles } from "@/ReduxToolKit/Reducers/UserContent/UserContentReducer"
import { populateResearch } from "@/ReduxToolKit/Reducers/UserContent/UserInvestigations"
import { authenticate } from "@/ReduxToolKit/Reducers/Athentication/Authentication";

export type SigninStatus = "pending" | "success" | "failed" | null;

interface useSignin {
    status: SigninStatus,
    setStatus: React.Dispatch<SetStateAction<SigninStatus>>
};

export const useSignIn = (
    userEmail: string | null,
    userPassword: string | null): useSignin => {
    const [status, setStatus] = useState<SigninStatus>(null);
    const [loggingIn, setLoggingIn] = useState<boolean>(false);
    const [successful, setSuccessful] = useState<boolean>(null);
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
            } else {
                setStatus("failed");
            }
        };

        if ((status === "pending")) {
            executeSignin()
        }

    }, [status]);


    return { status, setStatus };

};