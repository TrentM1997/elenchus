import { BLUESKY_EMAIL, BLUESKY_PASSWORD, getEnvVar } from "../src/Config";
import { BlueSkyService, IBlueSkyService } from "./blueSky/blueSkyService";
import { INewsAPIService, NewsAPIService } from "./newsApi/newsApiHandler";
import { AtpAgent } from "@atproto/api";
import { IWikipediaService, WikipediaService } from "./wiki/WikipediaService";
const NEWS_API_KEY = getEnvVar("NEWS_API_KEY");

export interface IIntegrations {
  readonly newsApi: INewsAPIService;
  readonly blueSky: IBlueSkyService;
  readonly wiki: IWikipediaService;
}

export class Integrations implements IIntegrations {
  public readonly newsApi: INewsAPIService;
  public readonly blueSky: IBlueSkyService;
  public readonly wiki: IWikipediaService;
  constructor() {
    this.wiki = new WikipediaService();
    this.newsApi = new NewsAPIService(NEWS_API_KEY);
    this.blueSky = new BlueSkyService(
      BLUESKY_EMAIL,
      BLUESKY_PASSWORD,
      new AtpAgent({ service: "https://bsky.social" }),
    );
  }
}
