import Trash from "@/components/React/global/IconComponents/Trash";
import React from "react";
import SavedArticleThumbnail from "./SavedArticleThumbnail";
import ThumbnailSwap from "./ThumbnailSwap";
import { BookmarkState } from "@/lib/hooks/dashboard/events/useBookmarkSavedArticles";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";

interface SavedThumbnail {
  article: ArticleSchemaType;
  deleteHandler: (article: ArticleSchemaType) => () => Promise<void>;
  fastScroll: boolean;
  bookmark: BookmarkState;
  isPriority?: boolean;
}

type FetchPriority = "high" | "low" | "auto";

type ImgProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fetchpriority?: FetchPriority; // lowercase HTML attr
};

function ArticleThumbnail({
  article,
  deleteHandler,
  fastScroll,
  isPriority,
  bookmark,
}: SavedThumbnail): React.ReactNode {
  const imgProps: ImgProps = {
    src: article.image_url ?? "",
    alt: article.title,
    loading: isPriority ? "eager" : "lazy",
    decoding: isPriority ? "sync" : "async",
    fetchpriority: isPriority ? "high" : "low",
    className:
      "w-full h-full object-cover rounded-t-3xl sm:rounded-r-3xl sm:rounded-t-none opacity-0 animate-fade-in animation-delay-200ms ease-soft",
    onError: (e) => {
      const img = e.currentTarget;
      img.onerror = null;
      img.src = "/images/logos/fallback.jpg";
    },
  };

  return (
    <div
      className="h-full w-full opacity-70 hover:opacity-90 transition-opacity duration-200 ease-in-out
        max-h-[9.6rem] sm:max-h-full md:max-w-60 lg:max-w-72 xl:max-w-112
        rounded-t-3xl sm:rounded-r-3xl sm:rounded-t-none
        object-cover relative overflow-hidden"
    >
      {fastScroll && <ThumbnailSwap />}
      {!fastScroll && <SavedArticleThumbnail imgProps={imgProps} />}
      <Trash
        bookmark={bookmark}
        deleteHandler={deleteHandler}
        article={article}
      />
    </div>
  );
}

export default React.memo(ArticleThumbnail);
