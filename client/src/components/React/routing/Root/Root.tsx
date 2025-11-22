import { Suspense } from "react";
import { ScrollRestoration, Outlet } from "react-router-dom";
import Navigation from "@/components/React/global/Navigation/Navigation";
import Pageskeleton from "../skeletons/PageSkeleton";
import Portal from "@/components/React/portal/root/Portal";
import RecoverSession from "@/components/React/global/recovery/RecoverSession";

export default function Root(): JSX.Element {

    return (
        <>
            <Navigation />
            <Portal />
            <Suspense fallback={<Pageskeleton />}
            >
                <RecoverSession >
                    <Outlet />
                    <ScrollRestoration />
                </RecoverSession>
            </Suspense>
        </>
    );
};