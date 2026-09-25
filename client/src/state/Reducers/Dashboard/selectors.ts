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


// Keep saved content mounted while refreshing it. A previous article's detail
// must never be used as the initial frame for a newly selected article.
export const selectArticleReviewState = createSelector(
  [
    (state: RootState) => state.dash.ArticleToReview,
    (state: RootState, articleId: number) => state.dash.articles.status === "ready"
      ? state.dash.articles.data.find(article => article.id === articleId)
      : undefined,
    (_state: RootState, articleId: number) => articleId,
  ],
  (detail, saved, articleId): RootState["dash"]["ArticleToReview"] => {
    if (detail.status === "ready" && detail.data.id === articleId) return detail;
    if (saved) return { status: "ready", data: saved };
    if (detail.status === "initial" || detail.status === "ready") {
      return { status: "pending" };
    }
    return detail;
  },
);
