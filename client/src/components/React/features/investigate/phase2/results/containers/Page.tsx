import { motion } from "framer-motion";
import { lazy } from "react";
const ArticleLink = lazy(() => import('../../results/components/links/ArticleLink'))
import { searchResultsVariants } from "@/motion/variants";
import ErrorBoundary from "@/components/React/Shared/ErrorBoundaries/ErrorBoundary";
import { Suspense } from "react";
import LinkPlaceholder from "../../search/components/loaders/LinkPlaceholder";
import React from "react";

function Page({ pageContent }) {

    return (
        <motion.ol
            layout
            aria-label="Search results"
            variants={searchResultsVariants}
            initial='closed'
            animate='open'
            exit='closed'
            className="relative h-full no-scrollbar
            w-full xl:max-w-6xl 2xl:w-full mx-auto justify-items-center
            grid grid-cols-1 sm:grid-cols-3 grid-flow-row 2xl:gap-y-6 2xl:gap-x-0 gap-2">
            {(Array.isArray(pageContent)) && (pageContent.length > 0) &&
                pageContent.map((article, index) => (
                    <Suspense key={article.url + index.toString()} fallback={<LinkPlaceholder />}>
                        <ArticleLink article={article} index={index} />
                    </Suspense>
                ))
            }
        </motion.ol>
    );
};


export default React.memo(Page);