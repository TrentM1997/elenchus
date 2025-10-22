import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/ReduxToolKit/store";
import { clearCharts } from "@/ReduxToolKit/Reducers/UserContent/ChartSlice";
import { clearUser } from "@/ReduxToolKit/Reducers/UserContent/UserContentReducer";
import { clearUserInvestigations } from "@/ReduxToolKit/Reducers/UserContent/UserInvestigations";
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