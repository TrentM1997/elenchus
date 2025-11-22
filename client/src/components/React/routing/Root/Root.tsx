import { Suspense } from "react";
import { ScrollRestoration } from "react-router-dom";
import Navigation from "@/components/React/global/Navigation/Navigation";
import { Outlet } from "react-router-dom";
import Pageskeleton from "../skeletons/PageSkeleton";
import Portal from "@/components/React/portal/root/Portal";
import { useRecoverSession } from "@/hooks/recovery/useRecoverSession";

export default function Root() {
    useRecoverSession();

    return (
        <>
            <Navigation
            />
            <Portal
            />
            <Suspense fallback={<Pageskeleton />}
            >
                <Outlet />
                <ScrollRestoration />
            </Suspense>
        </>
    );
};