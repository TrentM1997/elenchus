import { VirtuosoScrollPos } from "@/state/Reducers/Dashboard/UserContent/ProfileNavigationSlice";
import { ArticleSchemaType } from "../../../../../../../../../schemas/api/types/ArticlesSchema";

export interface ArticleScroller {
  articles: ArticleSchemaType[];
  restorePosition: Extract<VirtuosoScrollPos, { status: "ready" }>["position"];
}
