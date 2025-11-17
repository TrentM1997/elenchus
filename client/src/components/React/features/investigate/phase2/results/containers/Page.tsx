import { lazy, useEffect, useMemo } from "react";
const ArticleLink = lazy(() => import('../../results/components/links/ArticleLink'))
import { Suspense } from "react";
import LinkPlaceholder from "../../search/components/loaders/LinkPlaceholder";
import DelayedFallback from "@/components/React/Shared/fallbacks/DelayedFallback";
import type { RootState } from "@/ReduxToolKit/store";
import type { AppDispatch } from "@/ReduxToolKit/store";
import { useSelector, useDispatch } from "react-redux";
import { choose, discard } from "@/ReduxToolKit/Reducers/Investigate/ChosenArticles";
import type { ArticleType, SelectedArticle } from "@/env";
import { temporaryPaginationMute } from "@/ReduxToolKit/Reducers/Investigate/SearchResults";

interface Page {
    index: number,
    urlHash: Set<string>
};

export default function Page({ index, urlHash }: Page): JSX.Element | null {
    const page = useSelector((state: RootState) => state.investigation.search.pages[index]);
    const chosenArticles: SelectedArticle[] = useSelector((state: RootState) => state.investigation.getArticle.chosenArticles);
    const dispatch = useDispatch<AppDispatch>();


    const chooseArticle = (article: ArticleType): void => {

        const dataForServer: SelectedArticle = {
            url: article.url,
            source: article.provider,
            date: article.date_published,
            logo: article.logo,
            title: article.name,
            image: article.image.img
        };

        const exists = chosenArticles.some(((chosen: SelectedArticle) => chosen.url === article.url));

        if (!exists && chosenArticles.length <= 2) {
            dispatch(choose(dataForServer));

        } else if (exists) {
            const locatedAt = chosenArticles.findIndex((chosen => chosen.url === article.url))
            dispatch(discard(locatedAt))
        }
    };


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
                            chooseArticle={chooseArticle}
                            isPriority={(index <= 8)}
                            article={article}
                        />
                    </Suspense>
                ))
            }

        </ul>
    );
};

