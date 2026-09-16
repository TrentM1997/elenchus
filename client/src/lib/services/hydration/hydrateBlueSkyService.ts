import { BlueSkyPostSchemaType } from "@/lib/schemas/BlueSkySchemas";
import { ServerClient } from "../client/serverClient";

export type SplitBlueSkyFeed = {
  firstHalf: BlueSkyPostSchemaType[];
  secondHalf: BlueSkyPostSchemaType[];
};

export interface IHydrateBlueSkyService {
  hydrateFeed(): Promise<SplitBlueSkyFeed>;
}

export class HydrateBlueSkyService implements IHydrateBlueSkyService {
  constructor(private readonly server: ServerClient) {}

  public async hydrateFeed(): Promise<SplitBlueSkyFeed> {
    return await this.getFeed();
  }

  private async getFeed(): Promise<SplitBlueSkyFeed> {
    const posts = await this.server.general.integrations.blueSkyFeed();
    return this.splitFeed(posts);
  }

  private splitFeed(posts: BlueSkyPostSchemaType[]): SplitBlueSkyFeed {
    const postsUsed = posts.slice(0, Math.min(16, posts.length));
    const mid = Math.floor(postsUsed.length / 2);
    return {
      firstHalf: postsUsed.slice(0, mid),
      secondHalf: postsUsed.slice(mid),
    };
  }
}
