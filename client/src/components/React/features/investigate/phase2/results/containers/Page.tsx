import { lazy } from "react";
const ArticleLink = lazy(() => import('../../results/components/links/ArticleLink'))
import { Suspense } from "react";
import LinkPlaceholder from "../../search/components/loaders/LinkPlaceholder";
import DelayedFallback from "@/components/React/global/fallbacks/DelayedFallback";
import type { RootState } from "@/state/store";
import { useSelector } from "react-redux";
import type { ArticleType, SelectedArticle } from "@/env";

interface Page {
    index: number,
    urlHash: Set<string>,
    select: (article: ArticleType) => () => void
};

export default function Page({ index, urlHash, select }: Page): JSX.Element | null {
    const page = useSelector((state: RootState) => state.investigation.search.pages[index]);
    const chosenArticles: SelectedArticle[] = useSelector((state: RootState) => state.investigation.getArticle.chosenArticles);

    return (
        <ul
            className={`transform-gpu  will-change-[opacity,transform] contain-layout contain-paint overflow-hidden animation-delay-200ms
            relative h-full no-scrollbar py-2 opacity-0 animate-fade-in ease-soft
            w-full mx-auto justify-items-center
            grid grid-cols-1 sm:grid-cols-3 grid-flow-row lg:gap-y-6 2xl:gap-x-0 gap-2`}>
            {(Array.isArray(page)) && (page.length > 0) &&
                page.map((article: ArticleType, index: number) => (
                    <Suspense key={article.url} fallback={<DelayedFallback><LinkPlaceholder /></DelayedFallback>}>
                        <ArticleLink
                            highlight={urlHash.has(article.url)}
                            inModal={false}
                            mute={(chosenArticles?.length === 3)}
                            chooseArticle={select}
                            isPriority={(index <= 8)}
                            article={article}
                        />
                    </Suspense>
                ))
            }

        </ul>
    );
};

