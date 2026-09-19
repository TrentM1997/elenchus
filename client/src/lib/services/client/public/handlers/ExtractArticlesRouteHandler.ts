import { PublicServerClientRoutes } from "@/infra/transport/types/routeDefinitions";
import {
  ExecuteExtractResponseSchema,
  ExecuteExtractResponseSchemaType,
  ExtractionJobResultSchema,
  ExtractionJobResultSchemaType,
} from "@/lib/schemas/articles/ArticleSchema";
import { IHttpClient } from "../../http/types";

export interface IExtractArticlesRouteHandler {
  extract(
    body: SelectedArticle[],
    signal?: AbortSignal,
  ): Promise<ExecuteExtractResponseSchemaType>;
  poll({
    jobId,
    signal,
  }: {
    jobId: string;
    signal?: AbortSignal;
  }): Promise<ExtractionJobResultSchemaType>;
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
      `${this.routes.articles.poll}${encodeURIComponent(jobId)}`,
      ExtractionJobResultSchema,
      signal,
    );
  }

  public async extract(
    body: SelectedArticle[],
    signal?: AbortSignal,
  ): Promise<ExecuteExtractResponseSchemaType> {
    return await this.http.post(
      this.routes.articles.extract,
      ExecuteExtractResponseSchema,
      { articles: body },
      signal,
    );
  }
}
