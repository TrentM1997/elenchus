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
    const nextData = { id: 2 };
    byId.mockResolvedValueOnce({ ok: true, data: nextData });
    const nextRequest = isArticle
      ? store.dispatch(hydrateOpenedArticle(2))
      : store.dispatch(hydrateOpenInvestigation(2));
    await oldRequest;
    await nextRequest;
    resolveOld({ ok: true, data: { id: 1 } });
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(isArticle ? store.getState().ArticleToReview : store.getState().openInvestigation)
      .toEqual({ status: "ready", data: nextData });
  },
);
