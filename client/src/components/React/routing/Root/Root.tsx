import { useEffect, useLayoutEffect } from "react";
import { Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/ReduxToolKit/store";
import { useLoaderData, ScrollRestoration, useLocation } from "react-router-dom";
import type { RootPayload } from "../loaderFunctions/rootLoader";
import Navigation from "../../Shared/Navigation/Navigation";
import { Outlet } from "react-router-dom";
import { populateArticles } from "@/ReduxToolKit/Reducers/UserContent/UserContentReducer";
import { populateResearch } from "@/ReduxToolKit/Reducers/UserContent/UserInvestigations";
import { authenticate } from "@/ReduxToolKit/Reducers/Athentication/Authentication";
import Pageskeleton from "../skeletons/PageSkeleton";
import Portal from "@/components/React/portal/root/PortalRoot";

export default function Root() {
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

    return (
        <>
            <Navigation
            />
            <Portal
            />
            <Suspense
                fallback={
                    <Pageskeleton />
                }
            >
                <Outlet />
                <ScrollRestoration />
            </Suspense>
        </>
    );
};