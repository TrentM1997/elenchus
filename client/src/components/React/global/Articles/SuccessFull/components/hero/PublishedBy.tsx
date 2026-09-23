import React, { useMemo } from "react";
import type { ArticleSchemaType as Article } from "@/lib/schemas/articles/ArticleSchema";
import fallback from "../../../../../../../../public/images/logos/fallback.svg";
import { LOGOS } from "@/lib/helpers/lookup/logos";

export const slugLogo = (s: string) => {
  const item = s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "")
    .replace(/(^-|-$)/g, "");
  return item;
};

interface DatePubProps {
  article: Article;
}

function PublishedBy({ article }: DatePubProps): JSX.Element | null {
  const providerSlug = useMemo(
    () => slugLogo(article.provider ?? ""),
    [article.provider],
  );
  const dashboardPath = useMemo(() => {
    const altPath = article.logo || LOGOS[providerSlug] || fallback.src;
    return altPath;
  }, [article]);

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 p-1.5">
        <img src={dashboardPath} alt="" className="h-full w-full object-contain" />
      </div>
      <a
        href={article.article_url}
        target="_blank"
        title={`Visit source at - ${article.article_url}`}
        className="min-w-0 break-words text-sm font-light tracking-tight text-zinc-300 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-400"
      >
        {article.provider}
      </a>
    </div>
  );
}

export default React.memo(PublishedBy);
