import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/ReduxToolKit/store";
import { clearCharts } from "@/ReduxToolKit/Reducers/UserContent/ChartSlice";
import { clearUser } from "@/ReduxToolKit/Reducers/UserContent/UserContentReducer";
import { clearAuthSlice } from "@/ReduxToolKit/Reducers/Athentication/Authentication";
import { clearUserInvestigations } from "@/ReduxToolKit/Reducers/UserContent/UserInvestigations";

export function useClearUser(excecute: boolean): null {
    const dispatch = useDispatch<AppDispatch>();


    useEffect(() => {
        if (!excecute) return;
        dispatch(clearUserInvestigations());
        dispatch(clearCharts());
        dispatch(clearUser());

    }, [excecute]);

    return null;
};