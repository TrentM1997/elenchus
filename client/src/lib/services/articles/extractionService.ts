import { ExtractionJobResultSchemaType } from "@/lib/schemas/ArticleSchema";
import { IServerClient } from "../client/serverClient";
import { ExtractSelectedParams } from "../types";

export interface IExtractionService {
  extractArticles({
    articles,
    signal,
    onProgress,
  }: ExtractSelectedParams): Promise<ExtractionJobResultSchemaType>;
}

export class ExtractionService implements IExtractionService {
  constructor(private readonly server: IServerClient) {}

  public async extractArticles({
    articles,
    signal,
    onProgress,
  }: ExtractSelectedParams): Promise<ExtractionJobResultSchemaType> {
    return await this.executeExtract({ articles, signal, onProgress });
  }

  private async executeExtract({
    articles,
    signal,
    onProgress,
  }: ExtractSelectedParams): Promise<ExtractionJobResultSchemaType> {
    const { jobId }: { jobId: string } =
      await this.server.general.extraction.extract(articles);

    return await this.server.general.extraction.poll({
      jobId,
      signal,
    });
  }
}
