import { IServerClient } from "../client/serverClient";
import { BookmarkedArticlesResponseSchemaType } from "@/lib/schemas/articles/BookmarkSchema";
import { InvestigationsSavedReponseSchemaType } from "@/lib/schemas/InvestigationSchema";

interface IHydrateDashboardService {
  hydrate(): Promise<{
    articles: BookmarkedArticlesResponseSchemaType;
    investigations: InvestigationsSavedReponseSchemaType;
  }>;
}

export class HydrateDashboardService implements IHydrateDashboardService {
  constructor(private readonly server: Pick<IServerClient, "privileged">) {}

  public async hydrate(): Promise<{
    articles: BookmarkedArticlesResponseSchemaType;
    investigations: InvestigationsSavedReponseSchemaType;
  }> {
    return await this.execute();
  }

  private async execute(): Promise<{
    articles: BookmarkedArticlesResponseSchemaType;
    investigations: InvestigationsSavedReponseSchemaType;
  }> {
    const [articles, investigations] = await Promise.all([
      this.server.privileged.user.select.bookmarks(),
      this.server.privileged.user.select.investigations(),
    ]);

    return {
      articles,
      investigations,
    };
  }
}
