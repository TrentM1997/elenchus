import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { renderToStaticMarkup } from "react-dom/server";
import reducer from "../../state/Reducers/Dashboard/DashboardSlice";
import { selectArticleReviewState } from "../../state/Reducers/Dashboard/selectors";
import ArticleReview from "../../components/React/features/dashboard/Content/UserArticles/containers/ArticleReview";
import type { RootState } from "../../state/store";
import type { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";

jest.mock("../../lib/services/client/serverClient", () => ({ serverClient: {} }));
jest.mock("../../lib/hooks/useHydrateOpenedArticle", () => ({ useHydrateOpenedArticle: jest.fn() }));
jest.mock("../../components/React/global/fallbacks/DelayedFallback", () => ({
  __esModule: true, default: () => null,
}));
jest.mock("../../components/React/features/dashboard/ProfileNavigation/mobile/DetailView", () => ({
  __esModule: true, default: () => null,
}));
jest.mock("../../components/React/global/Articles/SuccessFull/containers/Article", () => ({
  __esModule: true,
  default: ({ articleData, animateEntrance }: { articleData: ArticleSchemaType; animateEntrance: boolean }) => (
    <article data-animate={String(animateEntrance)}>{articleData.full_text}</article>
  ),
}));

const saved: ArticleSchemaType = {
  id: 12, title: "Saved article", provider: "Publisher", article_url: "https://example.com/article",
  full_text: "Saved body", date_published: "2026-09-24", factual_reporting: null,
};
const state = (detail: RootState["dash"]["ArticleToReview"], articles = [saved]) => ({
  dash: {
    ...reducer(undefined, { type: "init" }),
    articles: { status: "ready", data: articles },
    ArticleToReview: detail,
  },
}) as RootState;

test.each(["initial", "pending", "failed"] as const)(
  "saved article stays available during %s refresh state", status => {
    const detail = status === "failed" ? { status, details: "Offline" } : { status };
    expect(selectArticleReviewState(state(detail), saved.id)).toEqual({ status: "ready", data: saved });
  },
);

test("a matching refresh replaces cached data without leaving the ready state", () => {
  const updated = { ...saved, full_text: "Updated body" };
  const detail = { status: "ready" as const, data: updated };
  expect(selectArticleReviewState(state(detail), saved.id)).toBe(detail);
});

test("does not render the previous article when the next article is uncached", () => {
  expect(selectArticleReviewState(state({ status: "ready", data: saved }), 99))
    .toEqual({ status: "pending" });
});

test("uncached articles preserve loading and error states", () => {
  expect(selectArticleReviewState(state({ status: "initial" }, []), 99))
    .toEqual({ status: "pending" });
  const failed = { status: "failed" as const, details: "Unavailable" };
  expect(selectArticleReviewState(state(failed, []), 99)).toBe(failed);
});

test("dashboard review renders cached content immediately without the entrance fade", () => {
  const store = configureStore({ reducer: () => state({ status: "pending" }) });
  const markup = renderToStaticMarkup(
    <Provider store={store}><ArticleReview articleId={saved.id} backTo={() => {}} /></Provider>,
  );
  expect(markup).toContain('data-animate="false"');
  expect(markup).toContain("Saved body");
  expect(markup).not.toContain("Loading article");
});
