import { lazy } from "react";
const ArticleLink = lazy(() => import('../../results/components/links/ArticleLink'))
import { Suspense } from "react";
import LinkPlaceholder from "../../search/components/loaders/LinkPlaceholder";
import DelayedFallback from "@/components/React/Shared/fallbacks/DelayedFallback";
import ScrolltoTop from "@/helpers/ScrollToTop";
import type { RootState } from "@/ReduxToolKit/store";
import type { AppDispatch } from "@/ReduxToolKit/store";
import { useSelector, useDispatch } from "react-redux";
import type { SelectedArticle } from "@/env";
import { choose, discard } from "@/ReduxToolKit/Reducers/Investigate/ChosenArticles";

interface Page {
    index: number
};

export default function Page({ index }: Page): JSX.Element | null {
    const page = useSelector((state: RootState) => state.investigation.search.pages[index]);
    const chosenArticles = useSelector((state: RootState) => state.investigation.getArticle.chosenArticles);
    const showGetArticlesModal = useSelector((state: RootState) => state.investigation.display.showGetArticlesModal);
    const dispatch = useDispatch<AppDispatch>();

    const chooseArticle = (article: ArticleType): void => {

        const dataForServer: SelectedArticle = {
            url: article.url,
            source: article.provider,
            date: article.article_pub_date,
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
        <ol
            className="relative h-full no-scrollbar py-2
            opacity-0 animate-fade-blur animation-delay-200ms transition-opacity ease-soft
            w-full xl:max-w-6xl 2xl:w-full mx-auto justify-items-center
            grid grid-cols-1 sm:grid-cols-3 grid-flow-row 2xl:gap-y-6 2xl:gap-x-0 gap-2">
            {(Array.isArray(page)) && (page.length > 0) &&
                page.map((article, index) => (
                    <Suspense key={article.url} fallback={<DelayedFallback><LinkPlaceholder /></DelayedFallback>}>
                        <ArticleLink inModal={false} showGetArticlesModal={showGetArticlesModal} chosenArticles={chosenArticles} mute={(chosenArticles?.length === 3)} chooseArticle={chooseArticle} isPriority={(index <= 8)} article={article} index={index} />
                    </Suspense>
                ))
            }
            <ScrolltoTop />

        </ol>
    );
};

