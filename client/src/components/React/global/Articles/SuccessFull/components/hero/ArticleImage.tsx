import React from "react";
import type { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import type { ImgProps } from "@/components/React/features/investigate/phase2/results/components/links/LinkThumbnail";
import fallback from "../../../../../../../../public/images/logos/fallbackImage.svg";

interface ArticleThumbnail {
  article: ArticleSchemaType;
}

function ArticleImage({ article }: ArticleThumbnail): JSX.Element | null {
  const imgProps: ImgProps = {
    src: article.image_url ?? fallback.src,
    alt: article.title,
    loading: "lazy",
    decoding: "async",
    fetchpriority: "auto",
    onError: (e) => {
      const img = e.currentTarget;
      img.onerror = null;
      img.src = "/images/logos/fallback.jpg";
    },
  };

  return (
    <div className="relative w-full overflow-hidden aspect-[16/10] rounded-2xl bg-white/5 ring-1 ring-inset ring-white/10">
      <img
        {...imgProps}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}

export default React.memo(ArticleImage);
