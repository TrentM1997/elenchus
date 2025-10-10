import React from "react";
import type { Article } from "@/ReduxToolKit/Reducers/Investigate/Reading";

interface ArticleThumbnail {
    article: Article
};

function ArticleImage({ article }: ArticleThumbnail): JSX.Element | null {
    const aspectClass = "w-[400px] aspect-[16/9] rounded-2xl lg:rounded-3xl sm:aspect-[2/1] lg:aspect-[3/2] w-full object-cover md:group-hover:shadow-blue-bottom transition-shadow duration-200 ease-[cubic-bezier(.2,.6,.2,1)]";

    return (
        <div className="absolute inset-0 w-full h-full bg-cover
            bg-center opacity-40 rounded-t-xl md:rounded-t-3xl">

            <img
                loading="lazy"
                className={`${aspectClass} bg-mirage`}
                width="400"
                src={article.image_url}
            />
        </div>
    );
};


export default React.memo(ArticleImage);

