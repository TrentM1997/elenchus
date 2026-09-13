import { BlueSkyPostSchemaType } from "../schemas/BlueSkyPostSchema";

interface BlueskyFeedItem {
  post: BlueSkyPostSchemaType;
  reply?: any;
  reason?: any;
}

export const unwrapObjects = (
  feed: BlueskyFeedItem[],
): BlueskyFeedItem["post"][] => {
  return feed.map((item) => item.post);
};
