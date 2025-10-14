import { lazy } from "react";
const ArticleLink = lazy(() => import('../../results/components/links/ArticleLink'))
import { Suspense } from "react";
import LinkPlaceholder from "../../search/components/loaders/LinkPlaceholder";
import React from "react";
import DelayedFallback from "@/components/React/Shared/fallbacks/DelayedFallback";
import ScrolltoTop from "@/helpers/ScrollToTop";

function Page({ pageContent }) {

    return (
        <ol
            className="relative h-full no-scrollbar py-2
            transform-gpu opacity-0 animate-fade-in transition-opacity animation-delay-300ms will-change-[opacity] ease-soft
            w-full xl:max-w-6xl 2xl:w-full mx-auto justify-items-center
            grid grid-cols-1 sm:grid-cols-3 grid-flow-row 2xl:gap-y-6 2xl:gap-x-0 gap-2">
            {(Array.isArray(pageContent)) && (pageContent.length > 0) &&
                pageContent.map((article, index) => (
                    <Suspense key={article.url + index.toString()} fallback={<DelayedFallback><LinkPlaceholder /></DelayedFallback>}>
                        <ArticleLink article={article} index={index} />
                    </Suspense>
                ))
            }
            <ScrolltoTop />

        </ol>
    );
};


export default React.memo(Page);