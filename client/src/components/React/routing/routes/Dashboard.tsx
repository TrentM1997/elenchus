import { useDispatch, useSelector } from "react-redux";
import { useIsMobile } from "@/hooks/useIsMobile";
import { lazy, Suspense, useEffect } from "react";
import { AppDispatch, RootState } from "@/ReduxToolKit/store";
import Display from "../../features/dashboard/Content/containers/Display";
import FooterBarLoader from "../../features/dashboard/ProfileNavigation/skeletons/FooterBarSkeleton";
import SidebarLoader from "../../features/dashboard/ProfileNavigation/skeletons/SidebarSkeleton";
import DelayedFallback from "../../global/fallbacks/DelayedFallback";
import { clearResearchScrollPos, clearScrollPosition, presentMetrics } from "@/ReduxToolKit/Reducers/UserContent/ProfileNavigationSlice";
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
            dispatch(presentMetrics());
        }
    }, []);


    return (
        <main
            className={
                `w-full h-full grid relative grid-cols-1 
            md:grid-cols-[auto,1fr] md:pt-6 min-h-dvh
           
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


        </main>
    )
};