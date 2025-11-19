import { lazy, Suspense } from "react";
import type { ActiveTab } from "@/ReduxToolKit/Reducers/UserContent/DashboardTabs";
import Metrics from "@/components/React/features/dashboard/Content/containers/Metrics";
import Pageskeleton from "@/components/React/routing/skeletons/PageSkeleton";
const SavedArticles = lazy(() => import('@/components/React/features/dashboard/Content/UserArticles/containers/SavedArticles'));
const SavedResearchLayout = lazy(() => import('@/components/React/features/dashboard/Content/SavedInvestigations/containers/SavedResearchLayout'));
import AccManagement from "@/components/React/features/dashboard/ProfileNavigation/AccountManagement/AccManagement";
import DelayedFallback from "@/components/React/Shared/fallbacks/DelayedFallback";
import OpenAssociatedArticle from "@/components/React/features/dashboard/Content/SavedInvestigations/containers/OpenAssociatedArticle";
import ArticleReview from "@/components/React/features/dashboard/Content/UserArticles/containers/ArticleReview";
import ResearchReview from "@/components/React/features/dashboard/Content/SavedInvestigations/containers/ResearchReview";



const renderTab = (tab: ActiveTab) => {

    switch (tab) {
        case "Metrics":
            return (
                <Metrics key={'metrics-tab'} />
            )
        case "Articles":
            return (
                <Suspense
                    key={'articles-boundary'}
                    fallback={
                        <DelayedFallback
                            key='delayed-article-boundary-loader'>
                            <Pageskeleton
                                key='saved-articles-page-skeleton'
                            />
                        </DelayedFallback>
                    }
                >
                    <SavedArticles
                        key={'saved-articles'}
                    />
                </Suspense>
            )
        case "Investigations":
            return (
                <Suspense
                    key={'research-boundary'}
                    fallback={
                        <DelayedFallback
                            key='delayed-research-boundary-loader'>
                            <Pageskeleton
                                key='saved-research-page-skeleton'
                            />
                        </DelayedFallback>}
                >
                    <SavedResearchLayout
                        key={'saved-research'}
                    />
                </Suspense>
            )
        case "Review Article":
            return (
                <ArticleReview
                    key={'article-opened-from-scroller'}
                />
            )
        case "Review Investigation":
            return (
                <ResearchReview
                    key='review-saved-investigation'
                />
            )
        case "Associated Article":
            return (
                <OpenAssociatedArticle
                    key='article-from-investigation'
                />
            )
        case "Manage Account":
            return (
                <AccManagement
                    key={'acc-management'}
                />
            )

        default: {
            const exhaustive: never = tab;
            return null;
        }
    }
};


export default renderTab;
