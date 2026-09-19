import { BLUESKY_EMAIL, BLUESKY_PASSWORD } from "../src/Config.js";
import { BlueSkyService, IBlueSkyService } from "./blueSky/blueSkyService.js";
import { INewsAPIService, NewsAPIService } from "./newsApi/newsApiHandler.js";
import { AtpAgent } from "@atproto/api";
import {
  IWikipediaService,
  WikipediaService,
} from "./wiki/WikipediaService.js";
import { NEWS_API_KEY } from "../src/Config.js";

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
