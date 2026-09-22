import { ArticleSchemaType } from "@/lib/schemas/articles/ArticleSchema";
import { VirtuosoScrollPos } from "@/state/Reducers/Dashboard/UserContent/ProfileNavigationSlice";

export interface ArticleScroller {
  articles: ArticleSchemaType[];
  restorePosition?: Extract<VirtuosoScrollPos, { status: "ready" }>["position"];
}
