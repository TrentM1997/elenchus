import ArticleHeader from "@/components/React/Shared/Articles/SuccessFull/components/hero/containers/ArticleHeader";
import ArticleContent from "@/components/React/Shared/Articles/SuccessFull/components/text/ArticleContent";
import type { Article } from "@/ReduxToolKit/Reducers/Investigate/Reading";
import React from "react";

interface FullSavedArticleProps {
    article: Article
};

function FullSavedArticle({ article }: FullSavedArticleProps): JSX.Element {


    return (
        <main className="relative top-0 left-0 right-0 flex flex-col grow px-4
                 w-full lg:max-w-lg xl:max-w-4xl min-h-screen scrollbar-hide
                 bg-black transition-all duration-200 ease-in-out">
            <ArticleHeader articleData={article} investigating={false} />
            <ArticleContent article_text={article.full_text} article_url={article.article_url} />
        </main>
    );
};


export default React.memo(FullSavedArticle);