import type { Article } from "@/ReduxToolKit/Reducers/Investigate/Reading";
import ArticleImage from "./ArticleImage";
import ArticleMetaData from "./ArticleMetaData";
import React from "react";
import ArticleTitle from "./ArticleTitle";
import PublishedBy from "./PublishedBy";

interface FrontMatterProps {
    article: Article
}

function FrontMatter({ article }: FrontMatterProps) {


    return (
        <div
            className="flex flex-col lg:flex-row justify-start items-end lg:gap-x-4 w-full lg:w-4/5">
            <div className="relative w-full 2xl:h-[14rem] flex flex-col items-start justify-end py-6 group">
                <ArticleImage
                    article={article}
                />
                <ArticleTitle title={article.title} />
                <PublishedBy article={article} />
            </div>

            <ArticleMetaData article={article} />
        </div>
    );
};


export default React.memo(FrontMatter)
