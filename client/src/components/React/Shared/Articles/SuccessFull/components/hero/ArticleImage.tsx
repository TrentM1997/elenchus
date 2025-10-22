import React from "react";
import type { Article } from "@/ReduxToolKit/Reducers/Investigate/Reading";
import ArticleTitle from "./ArticleTitle";
import PublishedBy from "./PublishedBy";

interface ArticleThumbnail {
    article: Article
};

function ArticleImage({ article }: ArticleThumbnail): JSX.Element | null {

    return (
        <div className="relative w-full sm:w-96 md:w-[350px] lg:w-[400px] xl:w-[800px] overflow-hidden aspect-[16/9] rounded-2xl">
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

