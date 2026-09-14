import {
  BlueSkyPostSchema,
  BlueSkyPostSchemaType,
} from "../../../../schemas/api/types/BlueSkyPostSchema";
import { validateSchema } from "../../../../schemas/api/validation/validateSchema";
import { ApiSuccess } from "../types/types";

export type SplitBlueSkyFeed = {
  firstHalf: BlueSkyPostSchemaType[];
  secondHalf: BlueSkyPostSchemaType[];
};

export interface IHydrateBlueSkyService {
  hydrateFeed(): Promise<SplitBlueSkyFeed>;
}

export class HydrateBlueSkyService implements IHydrateBlueSkyService {
  constructor() {}

  public async hydrateFeed(): Promise<SplitBlueSkyFeed> {
    return await this.getFeed();
  }

  private async getFeed(): Promise<SplitBlueSkyFeed> {
    const request = await fetch("/blueSky/feed", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!request.ok) {
      throw new Error("Failed to get BlueSky feed");
    }

    const body = (await request.json()) as ApiSuccess<unknown>;
    const posts = this.validateFeed(body.data);
    return this.splitFeed(posts);
  }

  private validateFeed(results: unknown): BlueSkyPostSchemaType[] {
    if (!Array.isArray(results)) {
      throw new Error("Invalid BlueSky feed response");
    }

    const posts: BlueSkyPostSchemaType[] = [];

    for (const item of results) {
      const result = validateSchema(BlueSkyPostSchema, item);

      if (result.ok) {
        posts.push(result.data);
      }
    }

    return posts;
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
