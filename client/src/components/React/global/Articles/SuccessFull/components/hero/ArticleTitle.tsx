import React from "react";

function ArticleTitle({ title }: { title: string | null }): JSX.Element {
  return (
    <h1 className="text-pretty text-xl font-light leading-snug tracking-tight text-zinc-100 sm:text-2xl xl:text-3xl">
      {title}
    </h1>
  );
}

export default React.memo(ArticleTitle);
