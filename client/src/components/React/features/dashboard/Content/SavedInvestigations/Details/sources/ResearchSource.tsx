import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/state/store";
import React from "react";
import { changeTab } from "@/state/Reducers/Dashboard/DashboardSlice";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";
import ThumbnailWithFallback from "@/components/React/global/fallbacks/ThumbnailWithFallback";
import SourceMetaData from "./SourceMetaData";

type ResearchSourceProps = {
  article: ArticleSchemaType;
};

function ResearchSource({ article }: ResearchSourceProps) {
  const dispatch = useDispatch<AppDispatch>();
  const tab = useSelector((s: RootState) => s.dash.tab);

  const handleArticleSelection = () => {
    if (tab.kind !== "investigations" || tab.display !== "review") return;
    dispatch(
      changeTab({
        kind: "investigations",
        display: "review",
        current: "article",
        investigationId: tab.investigationId,
        articleId: article.id,
      }),
    );
  };

  return (
    <li
      key={article.id}
      className="cursor-pointer mx-auto w-full xl:px-12 xl:w-fit md:max-w-4xl lg:max-w-6xl xl:max-w-7xl"
    >
      <div
        className="flex flex-col md:flex-row justify-between gap-12 md:gap-x-2 xl:gap-24 items-center"
        title={article.title}
      >
        <SourceMetaData
          title={article.title}
          provider={article.provider}
          date={article.date_published}
          authors={article.authors}
          handleArticleSelection={handleArticleSelection}
        />
        <ThumbnailWithFallback src={article.image_url} />
      </div>
    </li>
  );
}

export default React.memo(ResearchSource);
