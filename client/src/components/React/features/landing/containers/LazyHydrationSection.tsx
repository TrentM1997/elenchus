import { lazy, Suspense } from "react";
import BlueSkySkeleton from "../../blueSky/skeletons/BlueSkySkeleton";
import WikiAndNotes from "../components/WikiAndNotes";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
const BlueSkyPosts = lazy(
  () => import("@/components/React/features/blueSky/Containers/BlueSky"),
);
import DelayedFallback from "@/components/React/global/fallbacks/DelayedFallback";
import { useObserveAnimationState } from "@/lib/hooks/blueSky/useObserveAnimationState";

export default function LazyHydrationSection() {
  const selected = useSelector((state: RootState) => state.bluesky.selected);
  const { sentinelRef, feedRef, shouldAnimate, showBlueSky } =
    useObserveAnimationState();

  return (
    <section
      aria-label="animated components"
      className={`w-full h-auto z-20
        ${selected.status === "ready" ? "overflow-y-hidden" : ""}
        `}
    >
      <div ref={sentinelRef} className="h-1 w-full" />

      <WikiAndNotes />

      <div ref={feedRef} className="h-1 w-full" />

      {showBlueSky && (
        <Suspense
          fallback={
            <DelayedFallback>
              <BlueSkySkeleton context="home" />
            </DelayedFallback>
          }
        >
          {showBlueSky && (
            <BlueSkyPosts shouldAnimate={shouldAnimate} context="home" />
          )}
        </Suspense>
      )}
    </section>
  );
}
