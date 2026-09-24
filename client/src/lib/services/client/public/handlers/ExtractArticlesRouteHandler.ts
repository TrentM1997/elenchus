import type { PublicApiContract } from "@elenchus/contracts";
import { ExtractionResult } from "@elenchus/contracts/schemas/articles/ArticleSchema";
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
    private readonly routes: Pick<PublicApiContract, "articles">,
    private readonly http: IHttpClient,
  ) {
    this.pollRunner = new PollExtractionHandler({
      poll: this.poll.bind(this),
      extract: this.extract.bind(this),
    });
  }

  public async runExtractionJob(params: PollExtractionParams) {
    return await this.pollRunner.runExtraction(params);
  }

  public async poll({
    jobId,
    signal,
  }: {
    jobId: string;
    signal?: AbortSignal;
  }) {
    const route = this.routes.articles.poll;
    return await this.http.request(route, { params: { jobId: jobId }, signal });
  }

  public async extract(articles: SelectedArticle[], signal?: AbortSignal) {
    const route = this.routes.articles.extract;

    return await this.http.request(route, {
      body: { articles },
      signal,
    });
  }
}
