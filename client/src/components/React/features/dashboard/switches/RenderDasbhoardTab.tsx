import React, { lazy, Suspense } from "react";
import type { DashboardTab } from "@/state/Reducers/Dashboard/types";
import Metrics from "@/components/React/features/dashboard/Content/containers/Metrics";
import Pageskeleton from "@/components/React/routing/skeletons/PageSkeleton";
import AccManagement from "@/components/React/features/dashboard/ProfileNavigation/AccountManagement/AccManagement";
import DelayedFallback from "@/components/React/global/fallbacks/DelayedFallback";
import ArticleReview from "@/components/React/features/dashboard/Content/UserArticles/containers/ArticleReview";
import ResearchReview from "@/components/React/features/dashboard/Content/SavedInvestigations/containers/ResearchReview";
import { assertNever } from "@/lib/helpers/asserts/assertNever";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/state/store";
import { changeTab } from "@/state/Reducers/Dashboard/DashboardSlice";
const SavedArticles = lazy(
  () =>
    import("@/components/React/features/dashboard/Content/UserArticles/containers/SavedArticles"),
);
const SavedResearchLayout = lazy(
  () =>
    import("@/components/React/features/dashboard/Content/SavedInvestigations/containers/SavedResearchLayout"),
);

export default function RenderDasbhoardTab({
  tab,
}: {
  tab: DashboardTab;
}): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  switch (tab.kind) {
    case "metrics":
      return <Metrics />;
    case "manage account":
      return <AccManagement />;
    case "articles":
      const backToArticles = () => {
        dispatch(changeTab({ kind: "articles", display: "main" }));
      };

      return tab.display === "review" ? (
        <ArticleReview
          key={tab.articleId}
          articleId={tab.articleId}
          backTo={backToArticles}
        />
      ) : (
        <Suspense
          fallback={
            <DelayedFallback>
              <Pageskeleton />
            </DelayedFallback>
          }
        >
          <SavedArticles />
        </Suspense>
      );
    case "investigations":
      if (tab.display === "main")
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

      if (tab.current === "article") {
        const backToInvestigations = () => {
          dispatch(
            changeTab({
              kind: "investigations",
              display: "review",
              current: "investigation",
              investigationId: tab.investigationId,
            }),
          );
        };
        return (
          <ArticleReview
            key={tab.articleId}
            backTo={backToInvestigations}
            articleId={tab.articleId}
          />
        );
      }

      if (tab.current === "investigation") {
        return (
          <ResearchReview
            key={tab.investigationId}
            investigationId={tab.investigationId}
          />
        );
      }

    default: {
      return assertNever(tab);
    }
  }
}
