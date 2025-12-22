import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/state/store";
import { populateArticles } from "@/state/Reducers/UserContent/UserContentReducer";
import { populateResearch } from "@/state/Reducers/UserContent/UserInvestigations";
import { authenticate } from "@/state/Reducers/Athentication/Authentication";
import type { RootPayload } from "@/components/React/routing/loaderFunctions/rootLoader";
import { useLoaderData } from "react-router-dom";
import { useEffect } from "react";

const useRecoverSession = (): void => {
    const data = useLoaderData() as RootPayload;
    const { user, investigations, articles } = data;
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