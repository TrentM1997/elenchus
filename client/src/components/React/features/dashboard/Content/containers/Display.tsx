import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import { AnimatePresence, motion } from "framer-motion";
import { softEase, variants } from "@/motion/variants";
import type { ActiveTab } from "@/ReduxToolKit/Reducers/UserContent/DashboardTabs";
import Metrics from "./Metrics";
import Pageskeleton from "@/components/React/routing/skeletons/PageSkeleton";
const SavedArticles = lazy(() => import('../UserArticles/containers/SavedArticles'));
const SavedResearchLayout = lazy(() => import('../SavedInvestigations/containers/SavedResearchLayout'));
import AccManagement from "../../ProfileNavigation/AccountManagement/AccManagement";
import DelayedFallback from "@/components/React/Shared/fallbacks/DelayedFallback";
import OpenAssociatedArticle from "../SavedInvestigations/containers/OpenAssociatedArticle";
import ArticleReview from "../UserArticles/containers/ArticleReview";
import ResearchReview from "../SavedInvestigations/containers/ResearchReview";


export default function Display() {
    const tab: ActiveTab = useSelector((s: RootState) => s.dashboard.tab);

    return (
        <main
            className="opacity-0  animate-fade-in animation-delay-300ms
            w-full relative h-full min-h-dvh px-4 
            md:px-6 lg:px-0 mx-auto flex items-start justify-center pb-16"
        >
            <div className="absolute inset-0">

                {(tab === 'Metrics') &&
                    <Metrics key={'metrics'}
                    />
                }

                <Suspense
                    key={'articles-boundary'}
                    fallback={<DelayedFallback key='delayed-article-boundary-loader'><Pageskeleton key='saved-articles-page-skeleton' /></DelayedFallback>}
                >
                    {(tab === 'Articles') &&
                        <SavedArticles
                            key={'saved-articles'}
                        />
                    }
                </Suspense>

                <Suspense key={'research-boundary'} fallback={<DelayedFallback key='delayed-research-boundary-loader'><Pageskeleton key='saved-research-page-skeleton' /></DelayedFallback>}>
                    {(tab === 'Investigations') &&
                        <SavedResearchLayout
                            key={'saved-research'}
                        />
                    }
                </Suspense>

                {(tab === 'Review Investigation') &&
                    <ResearchReview
                        key='review-saved-investigation'
                    />
                }

                {(tab === 'Manage Account') &&
                    <AccManagement
                        key={'acc-management'}
                    />
                }

                {(tab === 'Associated Article') &&
                    <OpenAssociatedArticle
                        key='article-from-investigation'
                    />
                }

                {(tab === 'Review Article') &&
                    <ArticleReview
                        key={'article-opened-from-scroller'}
                    />
                }
            </div>
        </main>
    );
};