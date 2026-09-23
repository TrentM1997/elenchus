import React from "react";
import SourceInfo from "../SourceInfo";
import type { ArticleSchemaType as Article } from "@/lib/schemas/articles/ArticleSchema";

interface MetaData {
  article: Article;
}

function ArticleMetaData({ article }: MetaData): JSX.Element | null {
  return (
    <div className="min-w-0">
      <SourceInfo article={article} />
    </div>
  );
}

export default React.memo(ArticleMetaData);
