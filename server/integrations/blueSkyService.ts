import { AtpAgent } from "@atproto/api";
import { BlueSkyPostSchemaType } from "../schemas/BlueSkyPostSchema";
import { ServerError } from "../core/errors/ServerError";
import { BlueSkyParser, IBlueSkyParser } from "./blueSkyParser";

export interface IBlueSkyService {
  search(query: string): Promise<BlueSkyPostSchemaType[]>;
  feed(): Promise<BlueSkyPostSchemaType[]>;
}

export class BlueSkyService implements IBlueSkyService {
  private readonly parser: IBlueSkyParser;
  constructor(
    private readonly bsEmail: string,
    private readonly bsPassword: string,
    private readonly agent: AtpAgent,
  ) {
    this.parser = new BlueSkyParser();
  }

  public async search(query: string): Promise<BlueSkyPostSchemaType[]> {
    return await this.executeSearch(query);
  }

  public async feed(): Promise<BlueSkyPostSchemaType[]> {
    return await this.getFeed();
  }

  private async getFeed() {
    await this.agentLogin();
    const feedUri = await this.getFeedUri();
    if (!feedUri) {
      throw new ServerError("Couldn't find verified-news generator", 404);
    }
    return await this.getNewsFeed(feedUri);
  }

  private async getNewsFeed(feedUri: string): Promise<BlueSkyPostSchemaType[]> {
    const feed = await this.agent.api.app.bsky.feed.getFeed({
      feed: feedUri,
      limit: 20,
    });
    return this.parser.validateFeed(feed.data.feed);
  }

  private async getFeedUri(): Promise<string | undefined> {
    const suggested = await this.agent.api.app.bsky.feed.getSuggestedFeeds({});
    const gens = suggested.data.feeds;
    return gens.find((g) => g.uri.includes("verified-news"))?.uri;
  }

  private async executeSearch(query: string): Promise<BlueSkyPostSchemaType[]> {
    const session = await this.agentLogin();
    const result = await this.agent.api.app.bsky.feed.searchPosts(
      { q: query },
      {
        headers: {
          Authorization: `Bearer ${session.accessJwt}`,
        },
      },
    );
    return this.parser.validateSearchResults(result.data.posts);
  }

  private async agentLogin() {
    const { data: session } = await this.agent.login({
      identifier: this.bsEmail,
      password: this.bsPassword,
    });
    return session;
  }
}
