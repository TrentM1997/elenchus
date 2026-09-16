import { PublicServerClientRoutes } from "@/infra/transport/types/routeDefinitions";
import { IHttpClient } from "../../httpClient";
import {
  ExecuteExtractResponseSchema,
  ExecuteExtractResponseSchemaType,
  ExtractionJobResultSchema,
  ExtractionJobResultSchemaType,
} from "@/lib/schemas/ArticleSchema";

export interface IExtractArticlesRouteHandler {
  extract(body: SelectedArticle[]): Promise<ExecuteExtractResponseSchemaType>;
}

export class ExtractArticlesRouteHandler implements IExtractArticlesRouteHandler {
  constructor(
    private readonly routes: Pick<PublicServerClientRoutes, "articles">,
    private readonly http: Pick<IHttpClient, "post" | "get">,
  ) {}

  public async poll({
    jobId,
    signal,
  }: {
    jobId: string;
    signal?: AbortSignal;
  }): Promise<ExtractionJobResultSchemaType> {
    return await this.http.get(
      `${this.routes.articles.poll}${jobId}`,
      ExtractionJobResultSchema,
    );
  }

  public async extract(
    body: SelectedArticle[],
  ): Promise<ExecuteExtractResponseSchemaType> {
    return await this.http.post(
      this.routes.articles.extract,
      body,
      ExecuteExtractResponseSchema,
    );
  }
}
