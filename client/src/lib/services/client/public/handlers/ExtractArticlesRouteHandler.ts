import { PublicServerClientRoutes } from "@/infra/transport/types/routeDefinitions";
import {
  ExecuteExtractResponseSchema,
  ExecuteExtractResponseSchemaType,
  ExtractionJobResultSchema,
  ExtractionJobResultSchemaType,
  ExtractionResult,
} from "@/lib/schemas/articles/ArticleSchema";
import { IHttpClient } from "../../http/types";
import {
  IPollExtractionHandler,
  PollExtractionHandler,
  PollExtractionParams,
} from "./PollExtractionHandler";

export interface IExtractArticlesRouteHandler {
  runExtractionJob(params: PollExtractionParams): Promise<ExtractionResult>;
}

export class ExtractArticlesRouteHandler implements IExtractArticlesRouteHandler {
  private pollRunner: IPollExtractionHandler;
  constructor(
    private readonly routes: Pick<PublicServerClientRoutes, "articles">,
    private readonly http: Pick<IHttpClient, "post" | "get">,
  ) {
    this.pollRunner = new PollExtractionHandler({
      poll: this.poll.bind(this),
      extract: this.extract.bind(this),
    });
  }

  public async runExtractionJob(
    params: PollExtractionParams,
  ): Promise<ExtractionResult> {
    return await this.pollRunner.runExtraction(params);
  }

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
