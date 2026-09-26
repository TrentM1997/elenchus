import { configureStore } from "@reduxjs/toolkit";
import reducer, {
  clearOpenedArticle,
  clearOpenedInvestigation,
} from "../../state/Reducers/Dashboard/DashboardSlice";
import {
  hydrateOpenedArticle,
  hydrateOpenInvestigation,
} from "../../state/Reducers/Dashboard/thunks";
import { serverClient } from "../../lib/services/client/serverClient";

jest.mock("../../lib/services/client/serverClient", () => ({
  serverClient: {
    privileged: { user: { select: {
      bookmarks: { byId: jest.fn() },
      investigations: { byId: jest.fn() },
    } } },
  },
}));

beforeEach(() => jest.resetAllMocks());

const article = (id: number) => ({
  id, title: "Source", provider: "Publisher", article_url: `https://example.com/${id}`,
  full_text: "Article body", date_published: "2026-09-22", factual_reporting: null,
});
const investigation = (id: number) => ({
  id, created_at: "2026-09-22", idea: "Question", initial_perspective: null,
  ending_perspective: null, expertise: null,
});

test.each(["article", "investigation"] as const)(
  "leaving an open %s prevents its late response from replacing the next item",
  async (kind) => {
    const store = configureStore({ reducer });
    const isArticle = kind === "article";
    const byId = (isArticle
      ? serverClient.privileged.user.select.bookmarks.byId
      : serverClient.privileged.user.select.investigations.byId) as jest.Mock;
    let resolveOld!: (value: unknown) => void;
    byId.mockReturnValueOnce(new Promise(resolve => { resolveOld = resolve; }));
    const oldRequest = isArticle
      ? store.dispatch(hydrateOpenedArticle(1))
      : store.dispatch(hydrateOpenInvestigation(1));

    oldRequest.abort();
    store.dispatch(isArticle ? clearOpenedArticle() : clearOpenedInvestigation());
    const response = (id: number) => isArticle
      ? { ok: true, data: article(id) }
      : {
          investigation: { ok: true, data: investigation(id) },
          sources: { ok: true, data: [article(id)] },
        };
    byId.mockResolvedValueOnce(response(2));
    const nextRequest = isArticle
      ? store.dispatch(hydrateOpenedArticle(2))
      : store.dispatch(hydrateOpenInvestigation(2));
    await oldRequest;
    await nextRequest;
    resolveOld(response(1));
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(isArticle ? store.getState().ArticleToReview : store.getState().openInvestigation)
      .toEqual(isArticle
        ? { status: "ready", data: article(2) }
        : {
            investigation: { status: "ready", data: investigation(2) },
            sources: { status: "ready", data: [article(2)] },
          });
  },
);
