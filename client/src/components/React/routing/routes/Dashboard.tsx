import { useDispatch } from "react-redux";
import { useIsMobile } from "@/hooks/useIsMobile";
import { lazy, Suspense, useEffect } from "react";
import { AppDispatch } from "@/state/store";
import Display from "../../features/dashboard/Content/containers/Display";
import FooterBarLoader from "../../features/dashboard/ProfileNavigation/skeletons/FooterBarSkeleton";
import SidebarLoader from "../../features/dashboard/ProfileNavigation/skeletons/SidebarSkeleton";
import DelayedFallback from "../../global/fallbacks/DelayedFallback";
import { resetDashboardNavigation } from "@/state/Reducers/Dashboard/DashboardSlice";
import { useHydrateDashboard } from "@/lib/hooks/useHydrateDashboard";
const MobileProfileNav = lazy(
  () => import("../../features/dashboard/ProfileNavigation/mobile/ProfileMenu"),
);
const SideBar = lazy(
  () => import("../../features/dashboard/ProfileNavigation/SideBar/Sidebar"),
);

export default function Dashboard(): JSX.Element {
  const isMobile = useIsMobile();
  const dispatch = useDispatch<AppDispatch>();
  useHydrateDashboard();

  useEffect(() => {
    return () => {
      dispatch(resetDashboardNavigation());
    };
  }, []);

  return (
    <main
      className={`w-full h-full grid relative grid-cols-1 
            md:grid-cols-[auto,1fr] md:pt-6 min-h-dvh
           
            `}
    >
      {!isMobile && (
        <Suspense
          fallback={
            <DelayedFallback>
              <SidebarLoader />
            </DelayedFallback>
          }
        >
          <SideBar />
        </Suspense>
      )}

      {isMobile && (
        <Suspense
          fallback={
            <DelayedFallback>
              <FooterBarLoader />
            </DelayedFallback>
          }
        >
          <MobileProfileNav />
        </Suspense>
      )}

      <Display />
    </main>
  );
}
