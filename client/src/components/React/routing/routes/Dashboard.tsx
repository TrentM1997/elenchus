import { useSelector, shallowEqual } from "react-redux";
import { useIsMobile } from "@/hooks/useIsMobile";
import { lazy, Suspense, useMemo, useState } from "react";
import { RootState } from "@/ReduxToolKit/store";
import Display from "../../features/dashboard/Content/containers/Display";
import FooterBarLoader from "../../features/dashboard/ProfileNavigation/skeletons/FooterBarSkeleton";
import SidebarLoader from "../../features/dashboard/ProfileNavigation/skeletons/SidebarSkeleton";
import { AnimatePresence } from "framer-motion";
import SignOutModal from "../../session/forms/AuthForms/SignOutModal";
import { NavigateFunction, useNavigate } from "react-router-dom";
import ViewSavedContent from "../../features/dashboard/Content/containers/ViewSavedContent";
import DelayedFallback from "../../Shared/fallbacks/DelayedFallback";
import { SigninStatus } from "@/hooks/useSignIn";
const MobileProfileNav = lazy(() => import('../../features/dashboard/ProfileNavigation/mobile/ProfileMenu'));
const SideBar = lazy(() => import('../../features/dashboard/ProfileNavigation/SideBar/Sidebar'));


export default function Dashboard(): JSX.Element {
    const isMobile = useIsMobile();
    const { signingOut } = useSelector((state: RootState) => state.auth, shallowEqual);


    return (
        <main
            className={
                `w-full h-full grid relative grid-cols-1 
            ease-in-out md:grid-cols-[auto,1fr] md:pt-6 min-h-dvh
            transition-opacity
            ${signingOut
                    ? 'opacity-50 pointer-events-none'
                    : 'opacity-100 pointer-events-auto'
                } 
            `}>
            {!isMobile &&
                <Suspense fallback={<DelayedFallback><SidebarLoader /></DelayedFallback>}>
                    <SideBar />
                </Suspense>
            }

            {isMobile &&
                <Suspense fallback={<DelayedFallback><FooterBarLoader /></DelayedFallback>}>
                    <MobileProfileNav />
                </Suspense>
            }

            <Display />

            <AnimatePresence>
                {signingOut && <SignOutModal />}
            </AnimatePresence>
        </main>
    )
};