import Fallback from "../../../../../public/images/logos/fallback.jpg";
import React, { type JSX } from "react";

interface ThumbnailWithFallback {
  src: string | undefined | null;
  fallbackSrc?: ImageMetadata["src"];
}

function ThumbnailWithFallback({
  src,
  fallbackSrc = Fallback.src,
}: ThumbnailWithFallback): JSX.Element {
  const imageUrl = src && src !== "" ? src : fallbackSrc;

  return (
    <div className="w-auto">
      <img
        className="aspect-[16/9] w-88 md:w-128 lg:w-128 xl:max-w-[25rem] xl:min-w-[25rem] rounded-3xl object-cover sm:aspect-[2/1] overflow-hidden lg:aspect-[3/2]"
        width="560"
        height="380"
        src={imageUrl}
      />
    </div>
  );
}

export default React.memo(ThumbnailWithFallback);
