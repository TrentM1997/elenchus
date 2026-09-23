import type { ArticleSchemaType as Article } from "@/lib/schemas/articles/ArticleSchema";
import React from "react";

function SourceInfo({ article }: { article: Article }): JSX.Element {
  return (
    <dl className="flex flex-wrap items-start gap-x-6 gap-y-3 text-xs font-light tracking-tight sm:text-sm">
      <div className="flex flex-col gap-1">
        <dt className="text-xs text-zinc-400">Published</dt>
        <dd className="text-zinc-300">{article.date_published ?? "Date of publication unavailable"}</dd>
      </div>
      <div className="flex flex-col gap-1">
        <dt className="text-xs text-zinc-400">Source bias</dt>
        <dd className="text-zinc-300">{article.bias || "Unknown"}</dd>
      </div>
    </dl>
  );
}

export default React.memo(SourceInfo);
