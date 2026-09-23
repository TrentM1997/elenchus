import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/state/store";
const selectTab = (state: RootState) => state.dash.tab;
export const selectReviewedInvestigation = createSelector(
  [selectTab, (state: RootState) => state.dash.investigations],
  (tab, investigations) => tab.kind === "investigations" && tab.display === "review" && investigations.status === "ready"
    ? investigations.data.find(item => item.id === tab.investigationId) : undefined,
);
export const selectReviewedArticle = createSelector(
  [selectTab, (state: RootState) => state.dash.articles],
  (tab, articles) => "articleId" in tab && articles.status === "ready"
    ? articles.data.find(item => item.id === tab.articleId) : undefined,
);
export const selectReviewedSources = createSelector(
  [(state: RootState) => state.dash.openInvestigation, (state: RootState) => state.dash.articles],
  (investigation, articles) => investigation.status === "ready" && articles.status === "ready"
    ? articles.data.filter(article => investigation.data.sources?.includes(article.article_url)) : [],
);
