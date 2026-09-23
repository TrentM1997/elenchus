import { DashboardTab } from "@/state/Reducers/Dashboard/types";
import { lazy, Suspense, type JSX } from "react";
import Pageskeleton from "@/components/React/routing/skeletons/PageSkeleton";
import DelayedFallback from "@/components/React/global/fallbacks/DelayedFallback";
import RenderInvestigationReviewTab from "./RenderInvestigationReviewTab";
import { assertNever } from "@/lib/helpers/asserts/assertNever";
const SavedResearchLayout = lazy(
  () =>
    import("@/components/React/features/dashboard/Content/SavedInvestigations/containers/SavedResearchLayout"),
);

type RenderInvestigationTabProps = {
  tab: Extract<DashboardTab, { kind: "investigations" }>;
};

export default function RenderInvestigationTab({
  tab,
}: RenderInvestigationTabProps): JSX.Element {
  switch (tab.display) {
    case "main": {
      return (
        <Suspense
          fallback={
            <DelayedFallback>
              <Pageskeleton />
            </DelayedFallback>
          }
        >
          <SavedResearchLayout />
        </Suspense>
      );
    }
    case "review": {
      return <RenderInvestigationReviewTab tab={tab} />;
    }

    default: {
      return assertNever(tab);
    }
  }
}
