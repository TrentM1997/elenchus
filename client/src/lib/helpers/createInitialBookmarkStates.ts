import {
  BookmarkState,
  InitialBookmarkStatus,
} from "@/hooks/dashboard/useBookmarkSavedArticles";
import { ArticleSchemaType } from "@elenchus/contracts/schemas/articles/ArticleSchema";

export function createInitialBookmarkStates({
  articles,
  initialStatus,
}: {
  articles: ArticleSchemaType[];
  initialStatus: InitialBookmarkStatus;
}): Record<ArticleSchemaType["id"], BookmarkState> {
  const states: Record<ArticleSchemaType["id"], BookmarkState> = {};

  for (const article of articles) {
    states[article.id] = { status: initialStatus };
  }

  return states;
}
