import Trash from "@/components/React/global/IconComponents/Trash";
import React from "react"
import type { Article } from "@/ReduxToolKit/Reducers/Investigate/Reading";
import SavedArticleThumbnail from "./SavedArticleThumbnail";
import ThumbnailSwap from "./ThumbnailSwap";

interface SavedThumbnail {
    article: Article,
    deleteHandler: (article: Article) => Promise<void>,
    articleDeleted: boolean,
    fastScroll: boolean,
    isPriority?: boolean
};

type FetchPriority = 'high' | 'low' | 'auto';

type ImgProps = React.ImgHTMLAttributes<HTMLImageElement> & {
    fetchpriority?: FetchPriority; // lowercase HTML attr
};

function ArticleThumbnail({ article, deleteHandler, fastScroll, articleDeleted, isPriority }: SavedThumbnail): React.ReactNode {


    const imgProps: ImgProps = {
        src: article.image_url,
        alt: article.title,
        loading: isPriority ? 'eager' : 'lazy',
        decoding: isPriority ? 'sync' : 'async',
        fetchpriority: isPriority ? 'high' : 'low',
        className: 'w-full h-full object-cover rounded-t-3xl sm:rounded-r-3xl sm:rounded-t-none opacity-0 animate-fade-in animation-delay-200ms ease-soft',
        onError: (e) => {
            const img = e.currentTarget;
            img.onerror = null;
            img.src = '/images/logos/fallback.jpg';
        },
    };

    return (
        <div className="h-full w-full opacity-70 hover:opacity-90 transition-opacity duration-200 ease-in-out
        max-h-[9.6rem] sm:max-h-full md:max-w-60 lg:max-w-72 xl:max-w-112
        rounded-t-3xl sm:rounded-r-3xl sm:rounded-t-none
        object-cover relative overflow-hidden">
            {fastScroll && <ThumbnailSwap />}
            {!fastScroll && <SavedArticleThumbnail imgProps={imgProps} />}
            <Trash deleteHandler={deleteHandler} article={article} articleDeleted={articleDeleted} />
        </div>

    )
};

export default React.memo(ArticleThumbnail);





