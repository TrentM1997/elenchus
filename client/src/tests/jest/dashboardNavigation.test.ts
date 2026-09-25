import { configureStore } from "@reduxjs/toolkit";
import reducer, {
  changeTab, clearDashboardSlice, getMetrics, storeScrollPosition, storeResearchScrollPosition,
} from "../../state/Reducers/Dashboard/DashboardSlice";
import { hydrateDashboard, hydrateOpenInvestigation, hydrateOpenedArticle } from "../../state/Reducers/Dashboard/thunks";
import {
  selectReviewedArticle, selectReviewedInvestigation, selectReviewedSources,
} from "../../state/Reducers/Dashboard/selectors";
import type { RootState } from "../../state/store";

import { serverClient } from "../../lib/services/client/serverClient";

jest.mock("../../lib/services/client/serverClient", () => ({
  serverClient: { privileged: { user: { select: {
    bookmarks: { all: jest.fn() },
    investigations: { all: jest.fn() },
  } } } },
}));

beforeEach(() => jest.resetAllMocks());

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

test("list positions survive tab changes, but leaving clears all dashboard state", () => {
  const { store, state } = setup();
  const position = { topKey: 12, topIndex: 3, scrollTop: 400, dataVersion: 8 };
  store.dispatch(storeScrollPosition({ status: "ready", position }));
  store.dispatch(storeResearchScrollPosition({ status: "ready", position: { ...position, topKey: 34 } }));
  store.dispatch(changeTab({ kind: "manage account" }));
  expect(state().dash.articleScrollPosition).toEqual({ status: "ready", position });
  expect(state().dash.researchScrollPosition).toEqual({ status: "ready", position: { ...position, topKey: 34 } });
  store.dispatch(hydrateOpenedArticle.fulfilled({ ok: true, data: article }, "article", article.id));
  store.dispatch(hydrateOpenInvestigation.fulfilled({ ok: true, data: investigation }, "investigation", investigation.id));
  store.dispatch(getMetrics({
    bias: { status: "ready", data: [1] },
    integrity: { status: "ready", data: [1] },
    outcomes: { status: "ready", data: { neededMore: 0, validated: 100, neutral: 0, percentChanged: 0 } },
  }));
  store.dispatch(clearDashboardSlice());
  expect(state().dash.tab).toEqual({ kind: "metrics" });
  expect(state().dash.articleScrollPosition.status).toBe("initial");
  expect(state().dash.researchScrollPosition.status).toBe("initial");
  expect(state().dash).toEqual(reducer(undefined, { type: "init" }));
});


function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => { resolve = done; });
  return { promise, resolve };
}

test.each([false, true])(
  "aborted hydration cannot overwrite state after leaving (reentered: %s)",
  async (reentered) => {
    const { store, state } = setup();
    const bookmarks = jest.mocked(serverClient.privileged.user.select.bookmarks.all);
    const investigations = jest.mocked(serverClient.privileged.user.select.investigations.all);
    // Deliberately ignore cancellation in these mocks to simulate a late response.
    const oldArticles = deferred<Awaited<ReturnType<typeof bookmarks>>>();
    const oldInvestigations = deferred<Awaited<ReturnType<typeof investigations>>>();
    bookmarks.mockReturnValueOnce(oldArticles.promise);
    investigations.mockReturnValueOnce(oldInvestigations.promise);

    const request = store.dispatch(hydrateDashboard());
    expect(state().dash.articles.status).toBe("pending");
    expect(state().dash.investigations.status).toBe("pending");
    const signal = bookmarks.mock.calls[0][0];
    expect(signal).toBe(investigations.mock.calls[0][0]);
    expect(signal.aborted).toBe(false);

    request.abort();
    store.dispatch(clearDashboardSlice());
    expect(signal.aborted).toBe(true);

    const freshArticle = { ...article, id: 99 };
    const freshInvestigation = { ...investigation, id: 100 };
    if (reentered) {
      bookmarks.mockResolvedValueOnce({ ok: true, data: [freshArticle] });
      investigations.mockResolvedValueOnce({ ok: true, data: [freshInvestigation] });
      // Start the new visit before the old rejected action has settled.
      const freshRequest = store.dispatch(hydrateDashboard());
      await freshRequest;
    }

    const aborted = await request;
    expect(hydrateDashboard.rejected.match(aborted)).toBe(true);
    if (hydrateDashboard.rejected.match(aborted)) expect(aborted.meta.aborted).toBe(true);
    const expected = state().dash;
    if (reentered) {
      expect(expected.articles).toEqual({ status: "ready", data: [freshArticle] });
      expect(expected.investigations).toEqual({ status: "ready", data: [freshInvestigation] });
    } else {
      expect(expected).toEqual(reducer(undefined, { type: "init" }));
    }

    oldArticles.resolve({ ok: true, data: [article] });
    oldInvestigations.resolve({ ok: true, data: [investigation] });
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(state().dash).toEqual(expected);
  },
);
