import { configureStore } from "@reduxjs/toolkit";
import reducer, {
  changeTab,
  clearOpenedArticle,
  clearDashboardSlice,
  getMetrics,
  storeScrollPosition,
  storeResearchScrollPosition,
} from "../../state/Reducers/Dashboard/DashboardSlice";
import {
  hydrateDashboard,
  hydrateOpenInvestigation,
  hydrateOpenedArticle,
} from "../../state/Reducers/Dashboard/thunks";

import { serverClient } from "../../lib/services/client/serverClient";

jest.mock("../../lib/services/client/serverClient", () => ({
  serverClient: {
    privileged: {
      user: {
        select: {
          bookmarks: { all: jest.fn() },
          investigations: { all: jest.fn() },
        },
      },
    },
  },
}));

beforeEach(() => jest.resetAllMocks());

const article = {
  id: 12,
  title: "Source",
  provider: "Publisher",
  article_url: "https://example.com/source",
  full_text: "Article body",
  date_published: "2026-09-22",
  factual_reporting: null,
};
const investigation = {
  id: 34,
  created_at: "2026-09-22",
  idea: "Question",
  initial_perspective: null,
  ending_perspective: null,
  expertise: null,
};
const openedInvestigation = {
  investigation: { ok: true as const, data: investigation },
  sources: { ok: true as const, data: [article] },
};
const setup = () => {
  const store = configureStore({ reducer: { dash: reducer } });
  store.dispatch(
    hydrateDashboard.fulfilled(
      {
        articles: [article],
        investigations: [investigation],
      },
      "hydrate",
      undefined,
    ),
  );
  return { store, state: () => store.getState() };
};

test("investigation source navigation retains the parent ID and clears the article selection on return", () => {
  const { store, state } = setup();
  store.dispatch(
    changeTab({
      kind: "investigations",
      display: "review",
      current: "investigation",
      investigationId: 34,
    }),
  );
  expect(state().dash.tab).toEqual({
    kind: "investigations", display: "review", current: "investigation",
    investigationId: investigation.id,
  });
  store.dispatch(
    hydrateOpenInvestigation.fulfilled(
      openedInvestigation,
      "open",
      investigation.id,
    ),
  );
  expect(state().dash.openInvestigation.sources).toEqual({
    status: "ready",
    data: [article],
  });
  store.dispatch(
    changeTab({
      kind: "investigations",
      display: "review",
      current: "article",
      investigationId: 34,
      articleId: 12,
    }),
  );
  expect(state().dash.tab).toEqual({
    kind: "investigations", display: "review", current: "article",
    investigationId: investigation.id, articleId: article.id,
  });
  expect(state().dash.openInvestigation.investigation).toEqual({
    status: "ready", data: investigation,
  });
  store.dispatch(
    changeTab({
      kind: "investigations",
      display: "review",
      current: "investigation",
      investigationId: 34,
    }),
  );
  expect(state().dash.tab).toEqual({
    kind: "investigations", display: "review", current: "investigation",
    investigationId: investigation.id,
  });
});

test("investigation sources are independent of bookmarked articles", () => {
  const { store, state } = setup();
  store.dispatch(
    changeTab({
      kind: "investigations",
      display: "review",
      current: "investigation",
      investigationId: 34,
    }),
  );
  expect(state().dash.openInvestigation.sources).toEqual({ status: "initial" });
  const unbookmarkedSource = {
    ...article,
    id: 99,
    article_url: "https://example.com/unbookmarked",
  };
  store.dispatch(
    hydrateOpenInvestigation.fulfilled(
      {
        investigation: { ok: true, data: investigation },
        sources: { ok: true, data: [unbookmarkedSource] },
      },
      "open",
      investigation.id,
    ),
  );
  expect(state().dash.articles).toEqual({ status: "ready", data: [article] });
  expect(state().dash.openInvestigation.sources).toEqual({
    status: "ready",
    data: [unbookmarkedSource],
  });
  store.dispatch(
    hydrateOpenInvestigation.fulfilled(
      {
        investigation: { ok: true, data: investigation },
        sources: { ok: true, data: [] },
      },
      "reopen",
      investigation.id,
    ),
  );
  expect(state().dash.openInvestigation.sources).toEqual({
    status: "ready",
    data: [],
  });
});

test("article hydration clears stale detail while loading a missing article and when leaving", () => {
  const { store, state } = setup();
  store.dispatch(
    changeTab({ kind: "articles", display: "review", articleId: 12 }),
  );
  store.dispatch(hydrateOpenedArticle.fulfilled(
    { ok: true, data: article }, "first-article", article.id,
  ));
  expect(state().dash.ArticleToReview).toEqual({ status: "ready", data: article });
  store.dispatch(
    changeTab({ kind: "articles", display: "review", articleId: 999 }),
  );
  store.dispatch(hydrateOpenedArticle.pending("missing-article", 999));
  expect(state().dash.tab).toEqual({ kind: "articles", display: "review", articleId: 999 });
  expect(state().dash.ArticleToReview).toEqual({ status: "pending" });
  store.dispatch(hydrateOpenedArticle.rejected(new Error("Article not found"), "missing-article", 999));
  expect(state().dash.ArticleToReview).toEqual({
    status: "failed", details: "Failed to hydrate article",
  });
  store.dispatch(changeTab({ kind: "articles", display: "main" }));
  // The article hydration hook dispatches this cleanup when the review unmounts.
  store.dispatch(clearOpenedArticle());
  expect(state().dash.tab).toEqual({ kind: "articles", display: "main" });
  expect(state().dash.ArticleToReview).toEqual({ status: "initial" });
});

test("list positions survive tab changes, but leaving clears all dashboard state", () => {
  const { store, state } = setup();
  const position = { topKey: 12, topIndex: 3, scrollTop: 400, dataVersion: 8 };
  store.dispatch(storeScrollPosition({ status: "ready", position }));
  store.dispatch(
    storeResearchScrollPosition({
      status: "ready",
      position: { ...position, topKey: 34 },
    }),
  );
  store.dispatch(changeTab({ kind: "manage account" }));
  expect(state().dash.articleScrollPosition).toEqual({
    status: "ready",
    position,
  });
  expect(state().dash.researchScrollPosition).toEqual({
    status: "ready",
    position: { ...position, topKey: 34 },
  });
  store.dispatch(
    hydrateOpenedArticle.fulfilled(
      { ok: true, data: article },
      "article",
      article.id,
    ),
  );
  store.dispatch(
    hydrateOpenInvestigation.fulfilled(
      openedInvestigation,
      "investigation",
      investigation.id,
    ),
  );
  store.dispatch(
    getMetrics({
      bias: { status: "ready", data: [1] },
      integrity: { status: "ready", data: [1] },
      outcomes: {
        status: "ready",
        data: { neededMore: 0, validated: 100, neutral: 0, percentChanged: 0 },
      },
    }),
  );
  store.dispatch(clearDashboardSlice());
  expect(state().dash.tab).toEqual({ kind: "metrics" });
  expect(state().dash.articleScrollPosition.status).toBe("initial");
  expect(state().dash.researchScrollPosition.status).toBe("initial");
  expect(state().dash).toEqual(reducer(undefined, { type: "init" }));
});

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

test.each([false, true])(
  "aborted hydration cannot overwrite state after leaving (reentered: %s)",
  async (reentered) => {
    const { store, state } = setup();
    const bookmarks = jest.mocked(
      serverClient.privileged.user.select.bookmarks.all,
    );
    const investigations = jest.mocked(
      serverClient.privileged.user.select.investigations.all,
    );
    // Deliberately ignore cancellation in these mocks to simulate a late response.
    const oldArticles = deferred<Awaited<ReturnType<typeof bookmarks>>>();
    const oldInvestigations =
      deferred<Awaited<ReturnType<typeof investigations>>>();
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
      investigations.mockResolvedValueOnce({
        ok: true,
        data: [freshInvestigation],
      });
      // Start the new visit before the old rejected action has settled.
      const freshRequest = store.dispatch(hydrateDashboard());
      await freshRequest;
    }

    const aborted = await request;
    expect(hydrateDashboard.rejected.match(aborted)).toBe(true);
    if (hydrateDashboard.rejected.match(aborted))
      expect(aborted.meta.aborted).toBe(true);
    const expected = state().dash;
    if (reentered) {
      expect(expected.articles).toEqual({
        status: "ready",
        data: [freshArticle],
      });
      expect(expected.investigations).toEqual({
        status: "ready",
        data: [freshInvestigation],
      });
    } else {
      expect(expected).toEqual(reducer(undefined, { type: "init" }));
    }

    oldArticles.resolve({ ok: true, data: [article] });
    oldInvestigations.resolve({ ok: true, data: [investigation] });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(state().dash).toEqual(expected);
  },
);
