import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/ReduxToolKit/store";
import { populateArticles } from "@/ReduxToolKit/Reducers/UserContent/UserContentReducer";
import { populateResearch } from "@/ReduxToolKit/Reducers/UserContent/UserInvestigations";
import { authenticate } from "@/ReduxToolKit/Reducers/Athentication/Authentication";
import type { RootPayload } from "@/components/React/routing/loaderFunctions/rootLoader";
import { useLoaderData } from "react-router-dom";
import { useEffect } from "react";

const useRecoverSession = (): void => {
    const { user, articles, investigations } = useLoaderData() as RootPayload;
    const dispatch = useDispatch<AppDispatch>();


    useEffect(() => {
        if (user) {
            dispatch(authenticate(true));
            if (articles) dispatch(populateArticles(articles));
            if (investigations) dispatch(populateResearch(investigations));
        } else {
            dispatch(authenticate(false));
        }
    }, [user, articles, investigations, dispatch]);

};

export { useRecoverSession };