import { motion } from "framer-motion";
import { lazy } from "react";
const ArticleLink = lazy(() => import('../../results/components/links/ArticleLink'))
import { useSelector } from "react-redux";
import { RootState } from "@/ReduxToolKit/store";
import { searchResultsVariants } from "@/motion/variants";
import ErrorBoundary from "@/components/React/Shared/ErrorBoundaries/ErrorBoundary";
import { Suspense } from "react";
import DelayedFallback from "@/components/React/Shared/fallbacks/DelayedFallback";
import LinkPlaceholder from "../../search/components/loaders/LinkPlaceholder";
import LinkSkeletons from "../components/skeletons/LinkSkeletons";

export default function Page({ pageContent }) {
    const investigateState = useSelector((state: RootState) => state.investigation);
    const { search } = investigateState;
    const { status } = search;


    return (
        <motion.ol
            layout
            aria-label="Search results"
            variants={searchResultsVariants}
            initial='closed'
            animate='open'
            exit='closed'
            className="relative h-full no-scrollbar overflow-x-hidden 
            w-full xl:max-w-6xl 2xl:w-full mx-auto justify-items-center
            grid grid-cols-1 sm:grid-cols-3 grid-flow-row 2xl:gap-y-10 2xl:gap-x-0 gap-2">
            <ErrorBoundary>
                {(Array.isArray(pageContent)) && (pageContent.length > 0) &&
                    pageContent.map((article, index) => (
                        <Suspense key={article.url + index.toString()} fallback={<LinkPlaceholder />}>
                            <ArticleLink article={article} index={index} />
                        </Suspense>
                    ))
                }
            </ErrorBoundary>
        </motion.ol>
    );
};