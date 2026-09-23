import { configureStore } from "@reduxjs/toolkit";
import reducer, {
  changeTab, resetDashboardNavigation, storeScrollPosition, storeResearchScrollPosition,
} from "../../state/Reducers/Dashboard/DashboardSlice";
import { hydrateDashboard, hydrateOpenInvestigation } from "../../state/Reducers/Dashboard/thunks";
import {
  selectReviewedArticle, selectReviewedInvestigation, selectReviewedSources,
} from "../../state/Reducers/Dashboard/selectors";
import type { RootState } from "../../state/store";

jest.mock("../../lib/services/client/serverClient", () => ({ serverClient: {} }));

const article = {
  id: 12, title: "Source", provider: "Publisher", article_url: "https://example.com/source",
  full_text: "Article body", date_published: "2026-09-22", factual_reporting: null,
};
const investigation = {
  id: 34, created_at: "2026-09-22", idea: "Question", initial_perspective: null,
  ending_perspective: null, expertise: null, sources: [article.article_url],
};
const setup = () => {
  const store = configureStore({ reducer: { dash: reducer } });
  store.dispatch(hydrateDashboard.fulfilled({
    articles: { ok: true, data: [article] },
    investigations: { ok: true, data: [investigation] },
  }, "hydrate", undefined));
  return { store, state: () => store.getState() as RootState };
};

test("investigation source navigation preserves the investigation and resolves both IDs", () => {
  const { store, state } = setup();
  store.dispatch(changeTab({ kind: "investigations", display: "review", current: "investigation", investigationId: 34 }));
  expect(selectReviewedInvestigation(state())).toEqual(investigation);
  store.dispatch(hydrateOpenInvestigation.fulfilled({ ok: true, data: investigation }, "open", investigation.id));
  expect(selectReviewedSources(state())).toEqual([article]);
  store.dispatch(changeTab({ kind: "investigations", display: "review", current: "article", investigationId: 34, articleId: 12 }));
  expect(selectReviewedArticle(state())).toEqual(article);
  expect(selectReviewedInvestigation(state())).toEqual(investigation);
  store.dispatch(changeTab({ kind: "investigations", display: "review", current: "investigation", investigationId: 34 }));
  expect(selectReviewedArticle(state())).toBeUndefined();
  expect(selectReviewedInvestigation(state())).toEqual(investigation);
});

test("sources follow the fetched investigation instead of the dashboard list copy", () => {
  const { store, state } = setup();
  store.dispatch(changeTab({ kind: "investigations", display: "review", current: "investigation", investigationId: 34 }));
  expect(selectReviewedSources(state())).toEqual([]);
  store.dispatch(hydrateOpenInvestigation.fulfilled({
    ok: true, data: { ...investigation, sources: [] },
  }, "open", investigation.id));
  expect(selectReviewedInvestigation(state())?.sources).toEqual([article.article_url]);
  expect(selectReviewedSources(state())).toEqual([]);
});

test("article review cannot reuse a stale selection when navigating away or to a missing ID", () => {
  const { store, state } = setup();
  store.dispatch(changeTab({ kind: "articles", display: "review", articleId: 12 }));
  expect(selectReviewedArticle(state())).toEqual(article);
  store.dispatch(changeTab({ kind: "articles", display: "review", articleId: 999 }));
  expect(selectReviewedArticle(state())).toBeUndefined();
  store.dispatch(changeTab({ kind: "articles", display: "main" }));
  expect(selectReviewedArticle(state())).toBeUndefined();
});

test("list positions survive tab changes independently and reset without clearing hydrated data", () => {
  const { store, state } = setup();
  const position = { topKey: 12, topIndex: 3, scrollTop: 400, dataVersion: 8 };
  store.dispatch(storeScrollPosition({ status: "ready", position }));
  store.dispatch(storeResearchScrollPosition({ status: "ready", position: { ...position, topKey: 34 } }));
  store.dispatch(changeTab({ kind: "manage account" }));
  expect(state().dash.articleScrollPosition).toEqual({ status: "ready", position });
  expect(state().dash.researchScrollPosition).toEqual({ status: "ready", position: { ...position, topKey: 34 } });
  store.dispatch(resetDashboardNavigation());
  expect(state().dash.tab).toEqual({ kind: "metrics" });
  expect(state().dash.articleScrollPosition.status).toBe("initial");
  expect(state().dash.researchScrollPosition.status).toBe("initial");
  expect(state().dash.articles).toEqual({ status: "ready", data: [article] });
});
