import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { renderToStaticMarkup } from "react-dom/server";
import reducer from "../../state/Reducers/Dashboard/DashboardSlice";
import ArticleReview from "../../components/React/features/dashboard/Content/UserArticles/containers/ArticleReview";
import type { RootState } from "../../state/store";
import type { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";

jest.mock("../../lib/services/client/serverClient", () => ({ serverClient: {} }));
jest.mock("../../components/React/global/fallbacks/DelayedFallback", () => ({
  __esModule: true, default: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("../../components/React/features/dashboard/ProfileNavigation/mobile/DetailView", () => ({
  __esModule: true, default: () => null,
}));
jest.mock("../../components/React/global/Articles/SuccessFull/containers/Article", () => ({
  __esModule: true,
  default: ({ articleData, investigating }: { articleData: ArticleSchemaType; investigating?: boolean }) => (
    <article data-investigating={String(investigating)}>{articleData.full_text}</article>
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

// Server rendering reads the real hydration hook's Redux state without running
// effects. Request cancellation and cleanup are covered in dashboardDetailCancellation.
function renderReview(detail: RootState["dash"]["ArticleToReview"], articles = [saved]) {
  const store = configureStore({ reducer: () => state(detail, articles) });
  return renderToStaticMarkup(
    <Provider store={store}><ArticleReview articleId={saved.id} backTo={() => {}} /></Provider>,
  );
}

test("initial detail does not render bookmarked content before hydration", () => {
  expect(renderReview({ status: "initial" })).not.toContain("Saved body");
});

test("pending detail shows loading even when the article is bookmarked", () => {
  const markup = renderReview({ status: "pending" });
  expect(markup).toContain("Loading article");
  expect(markup).not.toContain("Saved body");
});

test("failed detail shows the hydration error instead of bookmarked content", () => {
  const markup = renderReview({ status: "failed", details: "Unavailable" });
  expect(markup).toContain("Unavailable");
  expect(markup).not.toContain("Saved body");
});

test("hydrated detail takes precedence over the bookmarked copy", () => {
  const markup = renderReview({ status: "ready", data: { ...saved, full_text: "Updated body" } });
  expect(markup).toContain("Updated body");
  expect(markup).not.toContain("Saved body");
});

test("dashboard review renders a hydrated article without a bookmark", () => {
  const markup = renderReview({ status: "ready", data: saved }, []);
  expect(markup).toContain('data-investigating="false"');
  expect(markup).toContain("Saved body");
  expect(markup).not.toContain("Loading article");
});
