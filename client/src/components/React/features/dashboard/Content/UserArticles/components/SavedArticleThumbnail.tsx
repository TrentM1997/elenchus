import React from "react";
import { ImgProps } from "./ArticleThumbnail";

function SavedArticleImage({ imgProps }: { imgProps: ImgProps }): JSX.Element {
  return <img {...imgProps} />;
}

export default React.memo(SavedArticleImage);
