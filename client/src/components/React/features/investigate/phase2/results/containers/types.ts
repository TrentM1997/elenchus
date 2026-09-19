import { BrowsingOptionSchemaType } from "@/lib/schemas/articles/BrowsingOptionSchema";

export interface Page {
  index: number;
  urlHash: Set<string>;
  select: (article: BrowsingOptionSchemaType) => () => void;
}
