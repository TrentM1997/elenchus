import { firecrawlClient } from "../services/firecrawl/client/firecrawlClient";
import {
  FirecrawlService,
  IFirecrawlService,
} from "../services/firecrawl/firecrawlService";
import { getEnvVar } from "../src/Config";
import { INewsAPIService, NewsAPIService } from "./newsApiHandler";
const NEWS_API_KEY = getEnvVar("NEWS_API_KEY");

export interface IIntegrations {
  readonly firecrawl: IFirecrawlService;
  readonly newsApi: INewsAPIService;
}

export class Integrations implements IIntegrations {
  public readonly firecrawl: IFirecrawlService;
  public readonly newsApi: INewsAPIService;
  constructor() {
    this.firecrawl = new FirecrawlService(firecrawlClient);
    this.newsApi = new NewsAPIService(NEWS_API_KEY);
  }
}
