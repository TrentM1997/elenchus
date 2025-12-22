import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import ArticleLink from "../results/components/links/ArticleLink";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useScrollWithShadow } from "@/hooks/useScrollWithShadow";
import type { SelectedArticle } from "@/env";

export default function DisplayThese() {
    const investigateState = useSelector((state: RootState) => state.investigation)
    const { chosenArticles } = investigateState.getArticle;
    const { articleOptions } = investigateState.search;
    const { boxShadow, onScrollHandler } = useScrollWithShadow();
    const isMobile = useIsMobile();
    const MOBILE_SHADOW = isMobile ? { boxShadow: boxShadow } : null;
    const optionsMap: Map<string, ArticleType> = useMemo(() => {

        const mappedOptions: Map<string, ArticleType> = new Map(
            articleOptions?.map((article: ArticleType) =>
                [article.url, article])
        );
        return mappedOptions;
    }, [articleOptions]);

    const selected = useMemo(() => {

        if (!chosenArticles?.length || !optionsMap.size) return [];
        return chosenArticles
            .map((a: SelectedArticle) => optionsMap.get(a.url))
            .filter(Boolean) as ArticleType[];
    }, [chosenArticles, optionsMap]);


    return (
        <div
            aria-label="Chosen articles container"
            className="flex items-center justify-center h-full w-full opacity-0 
                animate-fade-clip animation-delay-700ms ease-soft"
        >
            <div className="relative w-full h-[55dvh] sm:h-full mx-auto"
            >
                <ul
                    aria-label="Chosen articles displayed"
                    onScroll={onScrollHandler}
                    style={MOBILE_SHADOW}
                    className="py-2 mx-auto gap-y-2 
             w-full h-full relative overflow-y-auto no-scrollbar z-40  
              sm:flex-row sm:flex-wrap flex flex-col items-center 
              justify-start sm:justify-center sm:gap-x-3"
                >
                    {(selected.length > 0) &&
                        boxShadow &&
                        selected.map((article, i) => (
                            <ArticleLink
                                key={i}
                                inModal={true}
                                chosenArticles={chosenArticles}
                                article={article}
                                index={i}
                            />
                        ))
                    }
                </ul>
            </div>
        </div>

    )
};

