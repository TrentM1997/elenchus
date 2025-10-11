import React from "react";
import type { Article } from "@/ReduxToolKit/Reducers/Investigate/Reading";
import ArticleTitle from "./ArticleTitle";
import PublishedBy from "./PublishedBy";
import { useIsMobile } from "@/hooks/useIsMobile";

interface ArticleThumbnail {
    article: Article
};

function ArticleImage({ article }: ArticleThumbnail): JSX.Element | null {
    const isMobile = useIsMobile();
    const aspectClass = "w-[350px] md:w-[400px] lg:w-[800px] aspect-[2/1] xl:-translate-y-3 rounded-2xl lg:rounded-3xl sm:aspect-[2/1] xl:aspect-[16/9] w-full object-cover md:group-hover:shadow-blue-bottom transition-shadow duration-200 ease-[cubic-bezier(.2,.6,.2,1)]";

    return (
        <div className="relative w-full max-w-xl aspect-[16/9] overflow-hidden rounded-2xl">
            <img
                src={article.image_url}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-70"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 p-4 text-white z-10">
                <ArticleTitle title={article.title} />
                <PublishedBy article={article} />
            </div>
        </div>

    );
};


export default React.memo(ArticleImage);

