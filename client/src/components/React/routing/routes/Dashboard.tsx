import { useDispatch, useSelector } from "react-redux";
import { useIsMobile } from "@/hooks/useIsMobile";
import { lazy, Suspense, useEffect } from "react";
import { AppDispatch, RootState } from "@/ReduxToolKit/store";
import Display from "../../features/dashboard/Content/containers/Display";
import FooterBarLoader from "../../features/dashboard/ProfileNavigation/skeletons/FooterBarSkeleton";
import SidebarLoader from "../../features/dashboard/ProfileNavigation/skeletons/SidebarSkeleton";
import { AnimatePresence } from "framer-motion";
import SignOutModal from "../../session/forms/AuthForms/SignOutModal";
import DelayedFallback from "../../Shared/fallbacks/DelayedFallback";
import { clearResearchScrollPos, clearScrollPosition } from "@/ReduxToolKit/Reducers/UserContent/ProfileNavigationSlice";
const MobileProfileNav = lazy(() => import('../../features/dashboard/ProfileNavigation/mobile/ProfileMenu'));
const SideBar = lazy(() => import('../../features/dashboard/ProfileNavigation/SideBar/Sidebar'));


export default function Dashboard(): JSX.Element {
    const isMobile = useIsMobile();
    const signingOut = useSelector((state: RootState) => state.auth.signOut);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {

        return () => {
            dispatch(clearScrollPosition());
            dispatch(clearResearchScrollPos());
        }
    }, []);


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