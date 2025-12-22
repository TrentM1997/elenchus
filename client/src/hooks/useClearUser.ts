import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/state/store";
import { clearCharts } from "@/state/Reducers/UserContent/ChartSlice";
import { clearUser } from "@/state/Reducers/UserContent/UserContentReducer";
import { clearUserInvestigations } from "@/state/Reducers/UserContent/UserInvestigations";
import { SigninStatus } from "./useSignIn";

export function useClearUser(status: SigninStatus): null {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (status === 'idle') return;

        if (status === 'success')
            dispatch(clearUserInvestigations());
        dispatch(clearCharts());
        dispatch(clearUser());


    }, [status]);

    return null;
};