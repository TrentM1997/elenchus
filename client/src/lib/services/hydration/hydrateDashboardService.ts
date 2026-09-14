import { ApiSuccess } from "@/lib/types/types";
import {
  InvestigationSchema,
  InvestigationSchemaType,
} from "../../../../../schemas/api/types/InvestigationSchema";
import {
  ArticleSchema,
  ArticleSchemaType,
} from "../../../../../schemas/api/types/ArticlesSchema";
import { validateSchema } from "../../../../../schemas/api/validation/validateSchema";

type SavedInvestigationsResult =
  | {
      ok: false;
      message: string;
      details: string;
    }
  | {
      ok: true;
      data: InvestigationSchemaType[];
    };

interface IHydrateDashboardService {
  hydrate(): Promise<{
    articles: ArticleSchemaType[];
    investigations: InvestigationSchemaType[];
  }>;
}

export class HydrateDashboardService implements IHydrateDashboardService {
  constructor() {}

  public async hydrate(): Promise<{
    articles: ArticleSchemaType[];
    investigations: InvestigationSchemaType[];
  }> {
    return await this.execute();
  }

  private async execute(): Promise<{
    articles: ArticleSchemaType[];
    investigations: InvestigationSchemaType[];
  }> {
    const [articles, investigations] = await Promise.all([
      this.bookmarkedArticles(),
      this.investigations(),
    ]);

    return {
      articles,
      investigations,
    };
  }

  private async investigations(): Promise<InvestigationSchemaType[]> {
    const request = await fetch("/user/investigations", {
      method: "GET",
      credentials: "include",
    });

    if (!request.ok) {
      throw new Error("Failed to hydrate investigations");
    }

    const body = (await request.json()) as ApiSuccess<unknown>;

    if (body.status !== "success" || !Array.isArray(body.data)) {
      throw new Error("Invalid payload from saved investigations request");
    }

    return this.validateInvestigations(body.data);
  }

  private async bookmarkedArticles() {
    const request = await fetch("/user/bookmarks", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!request.ok) {
      throw new Error("Failed to get users bookmarked articles");
    }

    const body = (await request.json()) as ApiSuccess<unknown>;

    if (body.status !== "success" || !Array.isArray(body.data)) {
      throw new Error("Invalid payload from bookmarked articles request");
    }

    return this.validateArticles(body.data);
  }

  private validateArticles(response: unknown[]): ArticleSchemaType[] {
    const arr: ArticleSchemaType[] = [];

    for (const item of response) {
      const { ok, data } = validateSchema(ArticleSchema, item);
      if (ok) {
        arr.push(data);
      }
    }
    return arr;
  }

  private validateInvestigations(
    results: unknown[],
  ): InvestigationSchemaType[] {
    const arr: InvestigationSchemaType[] = [];

    for (const item of results) {
      const { ok, data } = validateSchema(InvestigationSchema, item);
      if (ok) {
        arr.push(data);
      }
    }
    return arr;
  }
}
