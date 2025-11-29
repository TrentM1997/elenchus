import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/ReduxToolKit/store";
import { populateArticles } from "@/ReduxToolKit/Reducers/UserContent/UserContentReducer";
import { populateResearch } from "@/ReduxToolKit/Reducers/UserContent/UserInvestigations";
import { authenticate } from "@/ReduxToolKit/Reducers/Athentication/Authentication";
import type { RootPayload } from "@/components/React/routing/loaderFunctions/rootLoader";
import { useLoaderData } from "react-router-dom";
import { useEffect } from "react";

const useRecoverSession = (): void => {
    const data = useLoaderData() as RootPayload | undefined;
    const user = data?.user ?? null;
    const articles = data?.articles ?? null;
    const investigations = data?.investigations ?? null;
    const dispatch = useDispatch<AppDispatch>();


    useEffect(() => {

        console.log(articles, investigations);

        if (data && user) {
            dispatch(authenticate(true));
            if (articles) dispatch(populateArticles(articles));
            if (investigations) dispatch(populateResearch(investigations));
        } else {
            dispatch(authenticate(false));
        }
    }, [user, articles, investigations, dispatch]);

};

export { useRecoverSession };