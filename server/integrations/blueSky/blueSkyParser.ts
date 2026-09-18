import {
  BlueSkyPostSchemaType,
  PostValidator,
  FeedItemValidator,
  SplitBlueSkyFeedSchemaType,
} from "../../schemas/BlueSkyPostSchema";

export interface BlueskyFeedItem {
  post: BlueSkyPostSchemaType;
  reply?: any;
  reason?: any;
}

export interface IBlueSkyParser {
  validateFeed(results: unknown[]): BlueSkyPostSchemaType[];
  validateSearchResults(results: unknown[]): BlueSkyPostSchemaType[];
  splitFeed(results: BlueSkyPostSchemaType[]): SplitBlueSkyFeedSchemaType;
}

export class BlueSkyParser implements IBlueSkyParser {
  public splitFeed(
    results: BlueSkyPostSchemaType[],
  ): SplitBlueSkyFeedSchemaType {
    return this.executeSplitFeed(results);
  }

  public validateFeed(results: unknown[]): BlueSkyPostSchemaType[] {
    return this.validateFeedResults(results);
  }

  public validateSearchResults(results: unknown[]): BlueSkyPostSchemaType[] {
    return this.validateResults(results);
  }

  private executeSplitFeed(
    posts: BlueSkyPostSchemaType[],
  ): SplitBlueSkyFeedSchemaType {
    const postsUsed = posts.slice(0, Math.min(16, posts.length));
    const mid = Math.floor(postsUsed.length / 2);
    return {
      firstHalf: postsUsed.slice(0, mid),
      secondHalf: postsUsed.slice(mid),
    };
  }

  private validateFeedResults(results: unknown[]): BlueSkyPostSchemaType[] {
    const feed = [];
    for (const result of results) {
      if (FeedItemValidator.Check(result)) {
        feed.push(result);
      } else {
        console.warn(
          "Skipped an invalid Bluesky post",
          [...FeedItemValidator.Errors(result)].map(({ path, message }) => ({
            path,
            message,
          })),
        );
      }
    }

    return this.unwrapFeedPosts(feed);
  }

  private validateResults(results: unknown[]): BlueSkyPostSchemaType[] {
    const posts: BlueSkyPostSchemaType[] = [];

    for (const result of results) {
      if (PostValidator.Check(result)) {
        posts.push(result);
      } else {
        console.warn(
          "Skipped an invalid Bluesky post",
          [...PostValidator.Errors(result)].map(({ path, message }) => ({
            path,
            message,
          })),
        );
      }
    }
    return posts;
  }

  private unwrapFeedPosts(feed: BlueskyFeedItem[]): BlueSkyPostSchemaType[] {
    return feed.map((item) => item.post);
  }
}
