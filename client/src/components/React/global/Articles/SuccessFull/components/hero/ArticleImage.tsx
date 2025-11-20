import React from "react";
import type { Article } from "@/ReduxToolKit/Reducers/Investigate/Reading";
import ArticleTitle from "./ArticleTitle";
import PublishedBy from "./PublishedBy";
import type { ImgProps } from "@/components/React/features/investigate/phase2/results/components/links/LinkThumbnail";

interface ArticleThumbnail {
    article: Article
};

interface ThumnailProps {
    imgProps: ImgProps
}

function ArticleImage({ article }: ArticleThumbnail): JSX.Element | null {

    const imgProps: ImgProps = {
        src: article.image_url,
        alt: article.title,
        loading: 'lazy',
        decoding: 'async',
        fetchpriority: 'auto',
        onError: (e) => {
            const img = e.currentTarget;
            img.onerror = null;
            img.src = '/images/logos/fallback.jpg';
        },
    };

    return (
        <div className="relative w-full sm:w-96 md:w-[350px] lg:w-[400px] xl:w-[800px] overflow-hidden aspect-[16/9] rounded-2xl">
            <img
                {...imgProps}
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

